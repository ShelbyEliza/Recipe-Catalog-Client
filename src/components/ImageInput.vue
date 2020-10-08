<template>
  <div>
    <div v-if="existingPictures">
    <b-form-row class="mb-1" v-for="image in existingPictures" :key="image.node.id">
      <b-col cols="2">
        <label>Existing Picture:</label>
      </b-col>
      <b-col id="thumbnailImageColumn">
        <b-img id="thumbnailImage" thumbnail :src="resolveImageUrlWidth(image.node.filename, 300, 300)" fluid></b-img>
      </b-col>
      <b-col>
        <b-button @click="removeExistingImage(image.node.id)">-</b-button>
      </b-col>
    </b-form-row>
    </div>
<!-- Add new picture begins -->
    <b-form-row class="mb-1" v-for="picture in formPictures" v-bind:key="picture.id">
      <b-col cols="2">
        <label>Picture:</label>
      </b-col>
      <b-col>
        <b-form-file 
          id="picture"
          v-model="picture.value"
          :state="Boolean(picture.value)"
          accept="image/*"
          placeholder="Choose file or drop it here"
        ></b-form-file>
      </b-col>
      <b-col>
        <div v-if="picture.value">
          <b-button @click="removeAddedPicture(picture)" v-if="picture.value">
            -
          </b-button>
          <b-button @click="addAnotherPicture()" 
                    v-if="pictureInputsFull && lastIndex == picture.id">
            +
          </b-button>
        </div>
      </b-col>
    </b-form-row>
  </div>
</template>

<script>
import resolveImage from '@/mixins/resolveImage';
import { GET_ONE_RECIPE } from '@/views/Recipe.vue';
import gql from 'graphql-tag';

/** 
 * GraphQL Query to delete a recipe
 */
export const DELETE_IMAGE = gql`
mutation DeleteImage($input: DeleteImageInput!){
  deleteImage (input: $input) {
    ok
  }
}
`

export default {
  name: "ImageInput",
  mixins: [ resolveImage ],
  data: function() {
     return {
     }
  },
  props: ['formPictures', 'existingPictures', 'recipeId'],
  methods: {
    /**
     * Add a new blank picture entry to formPictures.
     * This adds a new picture input field because the 
     * picture inputs are looped on formPictures 
     */
    addAnotherPicture: function () {
      var newIndex = 0;
      this.formPictures.forEach(picture => {
        if (picture.id > newIndex) {
          newIndex = picture.id;
        }
      })
      newIndex += 1;
      this.formPictures.push( {id: newIndex, value: null} );
    },
    /**
     * Remove the entry in formPictures. The picture has
     * not been added to the database at this point, so 
     * all we need to do is remove it from formPictures 
     * array.
     */
    removeAddedPicture: function(picture) {
      if(this.formPictures.length > 1) {
        var index = 0;
        for(var i=0; i < this.formPictures.length; i++) {
          if(this.formPictures[i].id == picture.id) {
            index = i;
          }
        }
        this.formPictures.splice(index, 1);
      } else {
        this.formPictures[0].value = null;
      }
    },
    /**
     * Remove a picture from the database by imageId. 
     * Updates the cache in update function.
     */
    removeExistingImage: function(imageId) {
      this.$apollo.mutate({
        mutation: DELETE_IMAGE,
        variables: {
          input: {
            id: imageId
          }
        },
        // eslint-disable-next-line
        update: (cache, { data: { deleteImage } }) => {
          // Update the cache.
          if (deleteImage.ok) {
            try {
              const data = cache.readQuery({
                query: GET_ONE_RECIPE,
                variables: {
                  recipeId: this.recipeId
                }
              })
              var imageArray = data.recipe.images.edges;
              console.log(imageArray);
              console.log(imageId)

              var filteredImageArray = imageArray.filter(function(value) {
                console.log("in filter callback: " + value)
                return (value.node.id != imageId)
                });
              data.recipe.images.edges = filteredImageArray;
              console.log(filteredImageArray)

              cache.writeQuery({
                query: GET_ONE_RECIPE,
                variables: {
                  recipeId: this.recipeId
                },
                data
              })
            } catch (e) {
              console.error(e)
              console.log(JSON.stringify(e.message))
            }
          }
        }
      })
    }
  },
  computed: {
    /**
     * Indicate if all formPictures have inputs filled.
     * Returns true if all objects in formPictures are 
     * non-null. False otherwise.
     */
    pictureInputsFull: function() {
      var full = true;
      this.formPictures.forEach(element => {
        if (!element.value) {
          full = false;
        }
      });
      return full;
    },
    /**
     * Returns the greatest index value from formPictures
     * array.
     */
    lastIndex: function() {
      var last = 0;
      this.formPictures.forEach(element => {
        if (element.id > last) {
          last = element.id;
        }
      })
      return last;
    }
  }
}
</script>

<style scoped>

  #thumbnailImage {
    background: rgb(37, 37, 37);
    border-color: black;
    width: 150px;
    height: 150px;
  }

</style>