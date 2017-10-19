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
  year={2017},
  url={https://arxiv.org/pdf/1705.06830.pdf},
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
activations on its previous layer.

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
feature-wise sigmoidal gating (a restricted version of FiLM) to condition a layer's
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
  booktitle={International Conference on Machine Learning},
  year={2017},
  url={https://arxiv.org/pdf/1705.03122.pdf},
}
```

-------------------------------------------------------------------------------

## Long Short-Term Memory

### Summary

This paper introduces the LSTM, a type of RNN built to handle long-term dependencies.
The LSTM uses feature-wise sigmoidal gating (a restricted version of FiLM) to condition
activations throughout time, based on the input at each time step.

### Connection to FiLM

This work and its subsequent success demonstrates the strength of feature-wise modulation...
1. in recurrent and sequential settings.
2. when conditioning on the same input.

### Bibtex

```
@article{hochreiter1997long,
  author={Hochreiter, Sepp and Schmidhuber, J\"{u}rgen},
  title={Long Short-Term Memory},
  journal={Neural Comput.},
  year={1997},
  url={http://dx.doi.org/10.1162/neco.1997.9.8.1735},
}
```

-------------------------------------------------------------------------------

## HyperNetworks

### Summary

"This work explores hypernetworks: an approach of using a one network, also known as a hypernetwork,
to generate the weights for another network... [H]ypernetworks can generate non-shared weights for
LSTM and achieve near state-of-the-art results on a variety of sequence modelling tasks...
[H]ypernetworks applied to convolutional networks still achieve respectable results
for image recognition tasks compared to state-of-the-art baseline models while
requiring fewer learnable parameters."

### Connection to FiLM

FiLM can be viewed as using one network to generate parameters of another network,
making it a form of hypernetwork.

### Bibtex

```
@inproceedings{ha2016hypernetworks,
  author={Ha, David and Dai, Andrew and Le, Quoc},
  title={HyperNetworks},
  booktitle={International Conference on Learning Representations},
  year={2016},
  url={https://arxiv.org/pdf/1609.09106.pdf},
}
```

-------------------------------------------------------------------------------

## Adaptive Mixtures of Local Experts

### Summary

This paper introduces the Mixture of Experts (MoE) models, which predicts based on a learned,
input-dependent, weighted average of "expert" networks.

### Connection to FiLM

FiLM conditions how experts, feature maps in this case, are used via an input-dependent affine
transformation. FiLM does not need to be followed by a weighted average but often instead uses
a learned, linear or convolutional layers to combine "expert" feature maps.

### Bibtex

```
@article{Jacobs:1991:AML:1351011.1351018,
 author = {Jacobs, Robert A. and Jordan, Michael I. and Nowlan, Steven J. and Hinton, Geoffrey E.},
 title = {Adaptive Mixtures of Local Experts},
 journal = {Neural Comput.},
 issue_date = {Spring 1991},
 volume = {3},
 number = {1},
 month = mar,
 year = {1991},
 issn = {0899-7667},
 pages = {79--87},
 numpages = {9},
 url = {http://dx.doi.org/10.1162/neco.1991.3.1.79},
 doi = {10.1162/neco.1991.3.1.79},
 acmid = {1351018},
 publisher = {MIT Press},
 address = {Cambridge, MA, USA},
}
```

-------------------------------------------------------------------------------

## Hierarchical Mixtures of Experts and the EM Algorithm

### Summary

This work extends _Adaptive Mixtures of Local Experts_ by introducing the Hierarchical Mixtures of
Experts, which uses a tree-structured architecture where nodes throughout the hierarchy are active
on a learned, input-dependent basis. This model is trained via MLE and EM.

### Connection to FiLM

FiLM also conditions how experts are used downstream via gating throughout the hierarchy of a model.

### Bibtex

```
@article{Jordan:1994:HME:188104.188106,
 author = {Jordan, Michael I. and Jacobs, Robert A.},
 title = {Hierarchical Mixtures of Experts and the EM Algorithm},
 journal = {Neural Comput.},
 issue_date = {March 1994},
 volume = {6},
 number = {2},
 month = mar,
 year = {1994},
 issn = {0899-7667},
 pages = {181--214},
 numpages = {34},
 url = {http://dx.doi.org/10.1162/neco.1994.6.2.181},
 doi = {10.1162/neco.1994.6.2.181},
 acmid = {188106},
 publisher = {MIT Press},
 address = {Cambridge, MA, USA},
}
```

-------------------------------------------------------------------------------

## Learning Factored Representations in a Deep Mixture of Experts

### Summary

This paper builds on _Adaptive Mixtures of Local Experts_ and _Hierarchical Mixtures of Experts and
the EM Algorithm_ to develop the Deep MoE, a MoE model that uses various, input-dependent
combinations of a previous level's experts as input into the next level's experts, which are also
used in various, input-dependent combinations. The break from the Hierarchical MoE's fixed tree
structure "exponentially increases the number of effective experts by associating each input with a
combination of experts at each layer". The Deep MoE "dynamically assembles a suitable expert
combination for each input" and conditions "gating and expert networks on the output of the previous
layer".

### Connection to FiLM

FiLM's conditioning in a neural network also resembles the "exponentially increase[ in] the number
of effective experts by associating each input with a combination of experts at each layer".
Also, FiLM too conditions throughout a hierarchy.

### Bibtex

```
@inproceedings{eigen2014deep,
  author={Eigen, David and Ranzato, Marc'Aurelio and Sutskever, Ilya},
  title={Learning Factored Representations in a Deep Mixture of Experts},
  booktitle={Proc. of ICLR Workshops},
  year={2014},
  url={https://arxiv.org/pdf/1312.4314.pdf},
}
```

-------------------------------------------------------------------------------

## Conditional Image Generation with PixelCNN Decoders

### Summary

"This work explores conditional image generation with a new image density model
based on the PixelCNN architecture. The model can be conditioned on any vector,
including descriptive labels or tags, or latent embeddings created by other networks."
Motivated by the LSTM, this work also introduces the Gated PixelCNN architecture,
which adds multiplicative interactions to the PixelCNN to improve performance.

### Connection to FiLM

Conditional PixelCNN conditions via feature-wise bias (FiLM with gamma=1).
Gated PixelCNN uses LSTM-like feature-wise sigmoidal self-conditioning (restricted version of FiLM).

### Bibtex

```
@inproceedings{van2016conditional,
  title={Conditional Image Generation with PixelCNN Decoders},
  author={Oord, Aaron van den and Kalchbrenner, Nal and Espeholt, Lasse and Vinyals, Oriol and
          Graves, Alex and Kavukcuoglu, Koray},
  booktitle={Proc. of NIPS},
  year={2016},
  url={https://arxiv.org/pdf/1606.05328.pdf},
}
```

-------------------------------------------------------------------------------

## WaveNet: A Generative Model for Raw Audio

### Summary

"This paper introduces WaveNet, a deep neural network for generating raw audio
waveforms. The model is fully probabilistic and autoregressive, with the predictive
distribution for each audio sample conditioned on all previous ones".
WaveNet achieves state-of-the-art text-to-speech and "can capture the characteristics of many
different speakers with equal fidelity... by conditioning on the speaker identity."

### Connection to FiLM

Similar to Conditional PixelCNN, WaveNet conditions via feature-wise bias (FiLM with gamma=1)
and uses LSTM-like feature-wise sigmoidal self-conditioning (restricted version of FiLM).

### Bibtex

```
@article{WaveNet,
  title={WaveNet: {A} Generative Model for Raw Audio},
  author={van den Oord, Aaron and Dieleman, Sander and Zen, Heiga and Simonyan, Karen and Vinyals,
          Oriol and Graves, Alex and Kalchbrenner, Nal and Senior, Andrew and Kavukcuoglu, Koray},
  journal={arXiv preprint arXiv:1609.03499},
  year={2016},
  url={https://arxiv.org/pdf/1609.03499.pdf},
}
```

-------------------------------------------------------------------------------
