# Literature survey

## Table of contents

* [A learned representation for artistic style](#a-learned-representation-for-artistic-style)
* [Exploring the structure of a real-time, arbitrary neural artistic stylization network](#exploring-the-structure-of-a-real-time-arbitrary-neural-artistic-stylization-network)
* [FiLM: Visual Reasoning with a General Conditioning Layer](#film-visual-reasoning-with-a-general-conditioning-layer)
* [Modulating early visual processing by language](#modulating-early-visual-processing-by-language)
* [Squeeze-and-Excitation Networks](#squeeze-and-excitation-networks)
* [Convolution Sequence-to-Sequence Learning](#convolution-sequence-to-sequence-learning)
* [Long Short-Term Memory](#long-short-term-memory)
* [HyperNetworks](#hypernetworks)
* [Adaptive Mixtures of Local Experts](#adaptive-mixtures-of-local-experts)
* [Hierarchical Mixtures of Experts and the EM Algorithm](#hierarchical-mixtures-of-experts-and-the-em-algorithm)
* [Learning Factored Representations in a Deep Mixture of Experts](#learning-factored-representations-in-a-deep-mixture-of-experts)
* [Conditional Image Generation with PixelCNN Decoders](#conditional-image-generation-with-pixelcnn-decoders)
* [WaveNet: A Generative Model for Raw Audio](#wavenet-a-generative-model-for-raw-audio)
* [Gated-Attention Readers for Text Comprehension](#gated-attention-readers-for-text-comprehension)
* [Gated-Attention Architectures for Task-Oriented Language Grounding](#gated-attention-architectures-for-task-oriented-language-grounding)
* [Overcoming catastrophic forgetting in neural networks](#overcoming-catastrophic-forgetting-in-neural-networks)
* [DiSAN: Directional Self-Attention Network for RNN/CNN-free Language Understanding](#disan-directional-self-attention-network-for-rnn/cnn-free-language-understanding)

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


## Modulating early visual processing by language

### Summary

This paper proposes to fuse language and vision processing from the lowest layer convolutional layers of a ResNet up to the top.
To do so, the authors formalize Conditional-Batch Normalization and output a change in pre-trained \gamma/\beta parameters of a ResNet from a language input.
Their approach breaks the classic VQA pipeline where linguistic input and vision input are mostly processed independently before being fused into a single
representation. 

### Connection to FiLM

This is the seminal work that introduced Conditional-Batch Norm for multimodal inputs.
FiLM extends and generalizes this initial approach to a single layer and decorallete the signal modulation from Batch-Normalization.
This paper provides the initial intuition about FiLM by pointing out that conditioning the affine transformation always results in better results than classic finetuning.
As opposed to FiLM, this work only focuses on modulating the signal on a pre-trained ResNet.
To that extend, the proposed approach is somehow more related to biological networks while this makes it less practical than FiLM. 

### Bibtex

```
@inproceedings{de2017modulating,
  author={de Vries, Harm and Strub, Florian and Mary, J{\'e}r{\'e}mie and Larochelle, Hugo and Pietquin, Olivier and Courville, Aaron},
  title={Modulating early visual processing by language},
  booktitle={Advances in Neural Information Processing Systems 30},
  year={2017},
  url={https://arxiv.org/pdf/1707.00683.pdf},
}
```

## Modulating early visual processing by language

### Summary

This paper proposes to fuse language and vision processing from the lowest layer convolutional layers of a ResNet up to the top.
To do so, the authors formalize Conditional-Batch Normalization and output a change in pre-trained \gamma/\beta parameters of a ResNet from a language input.
Their approach breaks the classic VQA pipeline where linguistic input and vision input are mostly processed independently before being fused into a single
representation. 

### Connection to FiLM

This is the seminal work that introduced Conditional-Batch Norm for multimodal inputs.
FiLM extends and generalizes this initial approach to a single layer and decorallete the signal modulation from Batch-Normalization.
This paper provides the initial intuition about FiLM by pointing out that conditioning the affine transformation always results in better results than classic finetuning.
As opposed to FiLM, this work only focuses on modulating the signal on a pre-trained ResNet.
To that extend, the proposed approach is somehow more related to biological networks while this makes it less practical than FiLM. 

### Bibtex

```
@inproceedings{de2017modulating,
  author={de Vries, Harm and Strub, Florian and Mary, J{\'e}r{\'e}mie and Larochelle, Hugo and Pietquin, Olivier and Courville, Aaron},
  title={Modulating early visual processing by language},
  booktitle={Advances in Neural Information Processing Systems 30},
  year={2017},
  url={https://arxiv.org/pdf/1707.00683.pdf},
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

## Gated-Attention Readers for Text Comprehension

### Summary

This paper introduces the Gated-Attention Reader, which conditions a document
reading network with an associated query via multiple steps of feature-wise
sigmoidal gating, obtaining state-of-the-art results for answering
cloze-style questions.

### Connection to FiLM

The form of gated attention used is feature-wise sigmoidal gating, used
throughout the hierarchy of a conditioned network. This paper also shows that
the method is superior to concatentation.

### Bibtex

```
@article{dhingra2016gated,
  title={Gated-Attention Readers for Text Comprehension},
  author={Dhingra, Bhuwan and Liu, Hanxiao and Yang, Zhilin, and
          Cohen, William W and Salakhutdinov, Ruslan},
  journal={arXiv preprint arXiv:1606.01549},
  year={2016}
}
```

-------------------------------------------------------------------------------

## Gated-Attention Architectures for Task-Oriented Language Grounding

### Summary

This paper trains an RL agent to follow simple natural language instructions
in a 3D environment (VizDoom) using Gated-Attention (feature-wise sigmoidal
gating) and shows that this approach is more successful that conditioning
via concatenation.

### Connection to FiLM

Conditions the visual input into a policy network via a single application of
feature-wise sigmoidal gating to allow agent to follow instructions.
The success of this method shows FiLM-like methods work in RL.

### Bibtex

Cross-Submission Workshop Paper at Language Grounding for Robotics Workshop at ACL 2017.
```
@article{DBLP:journals/corr/ChaplotSPRS17,
  author    = {Devendra Singh Chaplot and
               Kanthashree Mysore Sathyendra and
               Rama Kumar Pasumarthi and
               Dheeraj Rajagopal and
               Ruslan Salakhutdinov},
  title     = {Gated-Attention Architectures for Task-Oriented Language Grounding},
  journal   = {CoRR},
  volume    = {abs/1706.07230},
  year      = {2017},
  url       = {http://arxiv.org/abs/1706.07230},
  archivePrefix = {arXiv},
  eprint    = {1706.07230},
  timestamp = {Mon, 03 Jul 2017 13:29:02 +0200},
  biburl    = {http://dblp.org/rec/bib/journals/corr/ChaplotSPRS17},
  bibsource = {dblp computer science bibliography, http://dblp.org}
}
```

-------------------------------------------------------------------------------

## Overcoming catastrophic forgetting in neural networks

### Summary

This paper introduces Elastic Weight Consolidation, a penalty (motivated by
probability theory and neuroscience) on weights changing across tasks that
mitigates catastrophic forgetting in the continual learning setting.

### Connection to FiLM

This paper trains one agent that learns to play 10 Atari games using one
Double DQN with FiLM layers throughout its hierarchy, conditioned on the
current game. The success of this method shows FiLM works in RL, although
this result is not the main focus on the paper.

### Bibtex

```
@article{Kirkpatrick28032017,
  author = {Kirkpatrick, James and Pascanu, Razvan and Rabinowitz, Neil and Veness, Joel and
            Desjardins, Guillaume and Rusu, Andrei A. and Milan, Kieran and Quan, John and Ramalho,
            Tiago and Grabska-Barwinska, Agnieszka and Hassabis, Demis and Clopath, Claudia and
            Kumaran, Dharshan and Hadsell, Raia},
  title = {Overcoming catastrophic forgetting in neural networks},
  volume = {114},
  number = {13},
  pages = {3521-3526},
  year = {2017},
  doi = {10.1073/pnas.1611835114},
  URL = {http://www.pnas.org/content/114/13/3521.abstract},
  eprint = {http://www.pnas.org/content/114/13/3521.full.pdf},
  journal = {Proceedings of the National Academy of Sciences}
}
```

-------------------------------------------------------------------------------

## DiSAN: Directional Self-Attention Network for RNN/CNN-free Language Understanding

### Summary

This paper proposes a feature-wise attention mechanism for language understanding,
showing strong results on datasets such as SNLI.

### Connection to FiLM

The motivation for this FiLM-like approach in this pure
language setting is similar to that of FiLM for visual
reasoning or VQA:
"Word embedding usually suffers from the polysemy
in natural language. Since traditional attention computes
a single importance score for each word based on the
word embedding, it cannot distinguish the meanings of the
same word in different contexts. Multi-dimensional attention,
however, computes a score for each feature of each
word, so it can select the features that can best describe the
word’s specific meaning in any given context, and include
this information in the sentence encoding output s."

### Bibtex

```
@article{shen2017disan,
  title={DiSAN: Directional Self-Attention Network for RNN/CNN-free Language Understanding},
  author={Shen, Tao and Zhou, Tianyi and Long, Guodong and Jiang, Jing and Pan, Shirui and
          Zhang, Chengqi},
  journal={arXiv preprint arXiv:1709.04696},
  year={2017}
```
