import collections
import json
import pickle
import os
import sys

import numpy as np
import six
from six.moves import cPickle
from sklearn.manifold import TSNE


def run_tsne(input_path, output_path, perplexity=350, num_points=None):
    # Load data pickle
    with open(input_path, 'rb') as f:
        if six.PY3:
            data = cPickle.load(f, encoding='latin1')
        else:
            array = cPickle.load(f)

    # Slice through data if requested
    if num_points:
        data = data[:num_points]

    # Format data
    gamma_beta = np.concatenate(
        [np.transpose(
            np.stack((d['gammas'] for d in data), axis=0), [1, 0, 2]),
         np.transpose(
             np.stack((d['betas'] for d in data), axis=0), [1, 0, 2])],
        axis=2)
    gamma_beta = gamma_beta.transpose((1, 0, 2)).reshape((num_points, -1))
    question_types = np.stack((d['question_type'] for d in data), axis=0)
    questions = [d['question'] for d in data]

    # Initialize output data structure
    tsne_data = [{'question_type': int(qt), 'question': q} for qt, q in
                 zip(question_types, questions)]

    # Run t-SNE on gammas and betas
    tsne_map = TSNE(
        n_components=2,
        perplexity=perplexity,
        early_exaggeration=4.0,
        learning_rate=500.0,
        n_iter=5000,
        n_iter_without_progress=50,
        min_grad_norm=1e-07,
        metric='euclidean',
        init="random",
        verbose=10,
        random_state=1,
        method='barnes_hut',
        angle=0.5
    ).fit_transform(gamma_beta)

    # Populate output data structure
    for i, (x, y) in enumerate(tsne_map):
        tsne_data[i]['layer_all'] = {'x': float(x), 'y': float(y)}

    # Serialize result into a JSON file
    with open(output_path, 'w') as f:
        json.dump(tsne_data, f)


if __name__ == "__main__":
    run_tsne(
        input_path='/Users/vdumoulin/Downloads/res_baseline6.small.pkl',
        output_path='../../public/assets/clevr_res_baseline6.json',
        perplexity=350,
        num_points=3000)
