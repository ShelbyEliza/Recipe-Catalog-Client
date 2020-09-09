<!--
Home.vue contains: cards component setup and style options.
-->

<template>
  <b-container class="home" id="body">
    <div v-if="$apollo.queries.allRecipes.loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <h1 v-if="this.category">{{this.category}}</h1>
    <p v-if="filteredRecipes.length < 1">Couldn't find any {{category.toLowerCase()}} recipes.</p>
    <b-card-group columns>
      <b-card v-for="recipe in filteredRecipes" :key="recipe.node.id"
        id="recipe_card"
        :bgVariant="cardColor"
        :borderVariant="cardBorder"
        textVariant="primary"
      >
      <b-container>
        <b-row rows="1" v-on:click="clickRecipe(recipe.node.id)" >
          <b-card-title id="recipe_title">
            {{ recipe.node.title }}
          </b-card-title>
        </b-row>
      </b-container>
        <b-card-sub-title v-if="recipe.node.recipeCategory">
          {{ recipe.node.recipeCategory.name }}
        </b-card-sub-title>
        <b-card-text align="right">
          <b-form-rating 
            id="ratingId" 
            v-model="recipe.node.rating" 
            readonly 
            variant="warning" 
            size="sm" 
            inline value
            no-border>
          </b-form-rating>
        </b-card-text>
        <b-link v-if="recipe.node.webLink" :href="recipe.node.webLink" class=".card-link">Link</b-link>
      </b-card>
    </b-card-group>
  </b-container>
</template>

<script>
import gql from 'graphql-tag'
export const GET_ALL_RECIPES = gql`
query {
  allRecipes {
    edges {
      node {
        id
        title
        recipeCategory {
          id
          name
        }
        sourceType
        webLink
        bookTitle
        rating
      }
    }
  }
}`

export const GET_CATEGORIES = gql`
query categories {
  recipeCategories {
    edges {
      node {
        id
        name
        recipes {
          edges {
            node {
              title
            }
          }
        }
      }
    }
  }
}`

export default {
  name: 'Home',
  props: ['darkMode', 'category'],
  data () {
    return {
      allRecipes: [],
      recipeCategories: [],
      error: null
    }
  },
  methods: {
    /**
     * use view router to navigate to recipe page
     */
    clickRecipe: function (recipeId) {
      this.$router.push({ name: 'Recipe', params: { recipeId: recipeId } })
    }
  },
  apollo: {
    allRecipes: {
      query: GET_ALL_RECIPES,
      error (error) {
        this.error = JSON.stringify(error.message)
      }
    },
    recipeCategories: {
      query: GET_CATEGORIES,
      error (error) {
        this.error = JSON.stringify(error.message)
      }
    }
  },
  computed: {
    cardColor: function () {
      if (this.darkMode) {
        return "secondary"
      } else {
        return "black"
      }
    },
    cardBorder: function () {
      if (this.darkMode) {
        return "secondary"
      } else {
        return "primary"
      }
    },
    filteredRecipes: function () {
      if (this.category && this.allRecipes.edges) {
        var recipes = []
        console.log(this.allRecipes.edges)
        this.allRecipes.edges.forEach(element => {
          if((element.node.recipeCategory) && (element.node.recipeCategory.name == this.category)) {
            recipes.push(element);
          }
        })
        return recipes;
      }
      return this.allRecipes.edges;

      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #recipe_card {
    cursor: pointer;
    max-width: 20rem;
  }
  #body {
    margin-top: 35px;
    margin-bottom: 0px;
  }
</style>
