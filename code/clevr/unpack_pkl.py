import collections
import itertools
import json

import matplotlib
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt
import numpy as np
import six
from six.moves import cPickle

np.random.seed(1234)


def unpack(input_path, output_path):
    # Load data pickle
    with open(input_path, 'rb') as f:
        if six.PY3:
            data = cPickle.load(f, encoding='latin1')
        else:
            data = cPickle.load(f)

    output = {}

    # FiLM parameter histograms
    gammas = np.transpose(
        np.stack((d['gammas'] for d in data), axis=0), [1, 0, 2])
    betas = np.transpose(
        np.stack((d['betas'] for d in data), axis=0), [1, 0, 2])

    heatmap, xedges, yedges = np.histogram2d(
        gammas.ravel(), betas.ravel(), bins=64, normed=True)
    zs = heatmap.tolist()
    xs = (0.5 * (xedges[1:] + xedges[:-1])).tolist()
    ys = (0.5 * (yedges[1:] + yedges[:-1])).tolist()
    output['marginal_2d_histogram'] = [
        {'x': xs[i], 'y': ys[j], 'z': zs[i][j]} for i, j in
        itertools.product(range(64), range(64))]

    examples = np.random.choice(gammas.shape[1], size=5, replace=False)

    for name, params in [('gammas', gammas), ('betas', betas)]:
        hist, bin_edges = np.histogram(
            a=params,
            bins=128,
            normed=True)
        ys = hist.tolist()
        xs = (0.5 * (bin_edges[1:] + bin_edges[:-1])).tolist()
        output['marginal_{}_histogram'.format(name)] = [
            {'x': x, 'y': y} for x, y in zip(xs, ys)]
        for i, e in enumerate(examples):
            ys, bin_edges = np.histogram(
                a=params[:, e, :],
                bins=128,
                normed=True)
            xs = 0.5 * (bin_edges[1:] + bin_edges[:-1])
            output['example_{}_{}_histogram'.format(i, name)] = [
                {'x': x, 'y': y} for x, y in zip(xs, ys)]


    # Serialize result into a JSON file
    with open(output_path, 'w') as f:
        json.dump(output, f)


if __name__ == "__main__":
    unpack(
        input_path='/Users/vdumoulin/Downloads/res_baseline6.small.pkl',
        output_path='public/assets/film_clevr.json')
