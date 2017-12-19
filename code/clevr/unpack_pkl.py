import collections
import json

import matplotlib
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt
import numpy as np
import six
from six.moves import cPickle


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

    for name, params in [('gammas', gammas), ('betas', betas)]:
        ys, bin_edges = np.histogram(
            a=params,
            bins=128,
            normed=True)
        xs = 0.5 * (bin_edges[1:] + bin_edges[:-1])
        output['marginal_{}_histogram'.format(name)] = [
            {'x': x, 'y': y} for x, y in zip(xs, ys)]


    # Serialize result into a JSON file
    with open(output_path, 'w') as f:
        json.dump(output, f)


if __name__ == "__main__":
    unpack(
        input_path='/Users/vdumoulin/Downloads/res_baseline6.small.pkl',
        output_path='public/assets/film_clevr.json')
