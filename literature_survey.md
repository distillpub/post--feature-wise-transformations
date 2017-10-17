# Literature survey

## Table of contents

* [A learned representation for artistic style](#a-learned-representation-for-artistic-style)
* [Exploring the structure of a real-time, arbitrary neural artistic stylization network](#exploring-the-structure-of-a-real-time-arbitrary-neural-artistic-stylization-network)

## Instructions

Entries should follow this format:

## Paper title

### Summary

Short summary of the paper.

### Connection to FiLM

Why this paper is related to FiLM.

### Bibtex

_(This will be extremely useful when writing the actual article)_

```
@inproceedings{name2017title,
  author={Author, First and Author, Second},
  title={Paper title},
  booktitle={Proceedings of the International Conference on Something},
  year={2017},
  url={https://arxiv.org/pdf/1709.07871.pdf},
}
```

-------------------------------------------------------------------------------

## A Learned Representation For Artistic Style

### Summary

The paper extends fast feedforward style transfer networks to multiple styles
by introducing conditional instance normalization layers. Each style modeled by
the network is associated with its own set of instance normalization parameters,
and conditioning is achieved by assigning instance normalization parameters
their corresponding value for the desired style.

### Connection to FiLM

Conditional instance normalization can be seen as a specific instantiation of
FiLM, where FiLM layers are placed after instance normalization layers, and
where the FiLM-generating model is a simple embedding lookup.

### Bibtex

```
@inproceedings{dumoulin2017learned,
  author={Dumoulin, Vincent and Shlens, Jonathon and Kudlur, Manjunath},
  title={A Learned Representation for Artistic Style},
  booktitle={Proceedings of the International Conference on Learning Representations},
  year={2017},
  url={https://arxiv.org/pdf/1610.07629.pdf},
}
```

-------------------------------------------------------------------------------

## Exploring the structure of a real-time, arbitrary neural artistic stylization network

### Summary

The paper extends the work initiated in _A Learned Representation for Artistic
Style_ by introducing a _style prediction network_, which learns to map from an
arbitrary style image to the instance normalization parameters directly.

### Connection to FiLM

The addition of a style prediction network brings this work squarely into the
FiLM formulation: the FiLM-generating model is the style prediction network, and
the FiLM-ed network is the fast style transfer network.

### Bibtex

```
@inproceedings{ghiasi2017exploring,
  author={Ghiasi, Golnaz and Lee, Honglak and Kudlur, Manjunath and Dumoulin,
          Vincent and Shlens, Jonathon},
  title={Exploring the structure of a real-time, arbitrary neural artistic
         stylization network},
  booktitle={Proceedings of the British Machine Vision Conference},
  year={2017}
}
```

-------------------------------------------------------------------------------

## FiLM: Visual Reasoning with a General Conditioning Layer

### Summary

This paper:
1. Introduces the FiLM formulation.
2. Shows FiLM achieves state-of-the-art on various CLEVR visual reasoning tasks.
3. Shows FiLM learns reasoning's underlying structure and modulates features selectively.
4. Shows FiLM is robust, even w.r.t. placement after normalization.
5. Shows FiLM generalizes well from little data or even zero-shot.

### Connection to FiLM

This work introduces the FiLM framework and ties together much prior FiLM-related work.
This work also conducts an extensive analysis of FiLM, building up intuition.
FiLM's success on visual reasoning also shows FiLM can learn highly complicated,
structured, and multi-step functions.

### Bibtex

```
@inproceedings{perez2017film,
  author={Perez, Ethan and de Vries, Harm and Strub, Florian and Dumoulin,
          Vincent and Courville, Aaron C.},
  title={FiLM: Visual Reasoning with a General Conditioning Layer},
  journal={arXiv},
  year={2017},
  url={https://arxiv.org/pdf/1709.07871.pdf},
}
```

-------------------------------------------------------------------------------

## Squeeze-and-Excitation Networks

### Summary

This paper introduces the ImageNet 2017 winning model, a CNN architecture which uses
feature-wise sigmoidal gating (a restricted version of FiLM) to condition a layer's
activations on its previous layer

### Connection to FiLM

This work demonstrates the strength of feature-wise modulation...
1. in a pure vision setting.
2. when conditioning on the same input.

### Bibtex

```
@inproceedings{hu2017squeeze,
  author={Hu, Jie and Shen, Li and Sun, Gang},
  title={Squeeze-and-Excitation Networks},
  booktitle={ILSVRC 2017 Workshop at CVPR},
  year={2017},
  url={https://arxiv.org/pdf/1709.01507.pdf},
}
```

-------------------------------------------------------------------------------

## Convolution Sequence-to-Sequence Learning

### Summary

This paper introduces a purely convolutional model for machine translation that uses
feature-wise sigmoidal gating, a restricted version of FiLM, to condition a layer's
activations on its previous layer. Since this model does not forward or backpropagate
through time, it is faster and more parallelizable.

### Connection to FiLM

This work demonstrates the strength of feature-wise modulation...
1. in a pure language setting.
2. when conditioning on the same input.

### Bibtex

```
@inproceedings{gehring2017convolutional,
  author={Gehring, Jonas and Auli, Michael and Grangier, David and Yarats, Denis
          and Dauphin, Yann N.},
  title={Convolution Sequence-to-Sequence Learning},
  journal={International Conference on Machine Learning},
  year={2017},
  url={https://arxiv.org/pdf/1705.03122.pdf},
}
```

-------------------------------------------------------------------------------
