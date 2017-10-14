# Running the pre-trained style transfer model

1. Make sure TensorFlow r1.3 is [installed](https://www.tensorflow.org/install/).
2. Download and untar the
[the model checkpoint archive](https://storage.googleapis.com/download.magenta.tensorflow.org/models/arbitrary_style_transfer.tar.gz)
 into `checkpoint`.
3. Run the command
   ```bash
   python arbitrary_image_stylization_with_weights.py \
       --checkpoint=checkpoint/model.ckpt \
       --style_images_paths=images/style_images/Camille_Mauclair.jpg \
       --content_images_paths=images/content_images/golden_gate_sq.jpg \
       --output_dir=<OUTPUT_DIR> \
       --image_size=256 \
       --content_square_crop=False \
       --style_image_size=256 \
       --style_square_crop=False
   ```
