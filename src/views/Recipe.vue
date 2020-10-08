<!--
Recipe.vue allows you to view and edit established recipe.
-->

<template>
  <b-container class="recipe" v-if="recipe">
<!-- Title -->
    <b-row align-v="end">
      <b-col>
        <h1 class="mt-3 mb-1">{{ recipe.title }} 
          <b-form-rating 
            id="ratingId" 
            class="mt-1 mb-1"
            v-model="recipe.rating" 
            readonly 
            variant="warning" 
            size="sm" 
            inline value="10" 
            no-border>
          </b-form-rating>
        </h1>
      </b-col>
  <!-- Edit Button -->
      <b-col cols="*" align-h="end">
        <div>
          <b-button variant="success" @click="editRecipe">
            Edit
          </b-button>
        </div>
      </b-col>
    </b-row>
<!-- Category -->
    <p class="mt-1 mb-1" v-if="recipe.recipeCategory">
      Category: {{ recipe.recipeCategory.name }}
    </p>
<!-- Link -->
    <p class="mt-1 mb-1">
      Link: 
    </p>
    <p v-if="recipe.sourceType == 'Website'">{{ recipe.webLink }}</p>
<!-- Book Stuff -->
    <b-container v-if="recipe.sourceType == 'Book'" class="border border-dark mt-1 mb-3">
      <p class="mt-1 mb-1">Title: {{ recipe.bookTitle }}</p>
      <p class="mt-1 mb-1">Page: {{ recipe.bookPage }}</p>
      <p class="mt-1 mb-1">Image: {{ recipe.bookImagePath }}</p>
      <img :src=imageUrl v-if="recipe.bookImagePath">
    </b-container>
<!-- Notes -->
    <p class="mt-1 mb-1">Notes: </p>
    <p class="mb-5" v-html="recipe.notes" id="notesDescription"></p>
<!-- Pictures -->
    <p v-for="image in recipe.images.edges" :key="image.node.id">
      <b-img 
        id="photoFormat"
        :src="resolveImageUrl(image.node.filename)" 
        fluid alt="Responsive image" 
      >
      </b-img>
    </p>
  </b-container>
</template>

<script>
import resolveImage from '../mixins/resolveImage'
import gql from 'graphql-tag'
/**
 * GraphQL query to get data for a single recipe
 */
export const GET_ONE_RECIPE = gql`
query OneRecipe ($recipeId: ID!) {
  recipe (id: $recipeId) {
    id
    title
    recipeCategory {
      id
      name
    }
    sourceType
    webLink
    bookTitle
    bookPage
    bookImagePath
    notes
    rating
    images {
      edges {
        node {
          id
          filename
        }
      }
    }
  }
}`
export default {
  name: 'Recipe',
  mixins: [resolveImage],
  props: ['recipeId', 'darkMode'],
  data () {
    return {
      error: null,
    }
  },
  computed: {
    imageUrl: function() {
      var filename = this.recipe.bookImagePath
      return this.$hostname + 'image/' + filename
    }
  },
  methods: {
    editRecipe: function () {
      this.$router.push({ name: "EditRecipe", params: {recipeId: this.recipeId}})
    }
  },
  apollo: {
    recipe: {
      query: GET_ONE_RECIPE,
      variables () {
        return {
          recipeId: this.recipeId
        }
      },
      error (error) {
        this.error = JSON.stringify(error.message)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#dark {
  background-color: rgb(37, 31, 31);
}
#light {
  background-color: rgb(231, 182, 182);
}
#notesDescription {
  background-color:#3f33ec8a;
  padding-left: 25px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 4px;
}
#photoFormat {
  width: 50%;
  height: 70%;
}
</style>
