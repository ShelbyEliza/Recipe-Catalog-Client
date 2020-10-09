<!--
NewRecipe.vue adds a new recipe. 
-->

<template>
  <b-container id="NewRecipe">
    <div v-if="error">{{ error }}</div>
    <b-form @submit.prevent="onSubmit" @reset="onReset">
<!-- Rating and trash button begins -->
      <b-form-row>
        <b-col cols="2">
          <label for="rating-input">Rating:</label>
        </b-col>
        <b-col>
          <b-form-rating
            id="ratingId"
            v-model="form.rating"
            variant="warning"
            no-border
            size="md" 
            inline value="10" 
          ></b-form-rating>
        </b-col>
        <b-col align-self="end" cols="*" class="mb-3">
          <b-button 
            v-if="recipeId" 
            @click="deleteRecipe" 
            variant="danger" 
            size="sm">
            <b-icon icon="trash"></b-icon>
            </b-button>
        </b-col>
      </b-form-row>
<!-- Title form begins -->
      <b-form-row class="mb-1">
        <b-col cols="2">
          <label for="title-input">Title: </label>
        </b-col>
        <b-col>
          <b-form-input
            id="title-input"
            v-model="form.title"
            required
            placeholder="Enter Title"
          ></b-form-input>
        </b-col>
      </b-form-row>
<!-- Title ends, Category begins -->      
      <b-form-row class="mb-1">
        <b-col cols="2">
          <label for="category-input">Category:</label>
        </b-col>
        <b-col>
          <b-form-select
            id="category-input"
            v-model="form.category"
            :options="categoryNames"
            required
          ></b-form-select>
        </b-col>
      </b-form-row >
<!-- Category ends, Type begins -->
      <b-form-row class="mb-1">
        <b-col cols="2">
          <label for="type-input">Type:</label>
        </b-col>
        <b-col>
          <b-form-select
            id="type-input"
            v-model="form.recipeType"
            :options="recipeTypes"
            required
          ></b-form-select>
        </b-col>
      </b-form-row >
<!-- WebSite option begins -->
      <b-form-row v-if="isWeb" class="mb-1">
        <b-col cols="2">
          <label for="link-input">Link:</label>
        </b-col>
        <b-col>
          <b-form-input
            id="link-input"
            v-model="form.web.link"
            required
            :state="validateRecipeWebLink"
          ></b-form-input>
        </b-col>
      </b-form-row>
<!-- Book title option begins -->
      <b-form-row v-if="isBook" class="mb-1">
        <b-col cols="2">
          <label for="book-title-input">Book Title:</label>
        </b-col>
        <b-col>
          <b-form-input
            id="book-title-input"
            v-model="form.book.title"
            required
          ></b-form-input>
        </b-col>
        <b-col cols="1">
          <label for="book-pg-input">Page:</label>
        </b-col>
        <b-col cols="1">
          <b-form-input
            id="book-pg-input"
            v-model="form.book.page"
            required
            type="number"
            min=0
          ></b-form-input>
        </b-col>
      </b-form-row>
<!-- Book picture option begins -->
      <b-form-row v-if="isBook" class="mb-1">
        <b-col cols="2">
          <label for="book-picture">Picture of Recipe:</label>
        </b-col>
        <b-col>
          <b-form-file
            id="book-picture"
            v-model="form.book.picture"
            :state="Boolean(form.book.picture)"
            accept="image/*"
            placeholder="Choose file or drop it here"
          ></b-form-file>
        </b-col>
      </b-form-row>
<!-- Type ends,  -->
<!-- Notes begins -->
      <b-form-row class="mb-1">
        <b-col cols="2">
          <label for="notes-input">Notes:</label>
        </b-col>
<!-- End of Title Lable -->
<!-- Begin notesEditor -->
        <b-col>
          <div class="editor">
<!-- Begin EditorMenu -->
            <editor-menu-bar :editor="editor" v-slot="{commands, isActive}">
              <div class="editorMenuBar mb-1" id="menuBarStyle">
<!-- Begin Buttons -->
                <button type="button"        
                  class="menubar__button"
                  :class="{ 'is-active': isActive.bold() }"
                  @click="commands.bold"
                >
                  <b-icon icon="type-bold"></b-icon>
                </button>
                <button type="button"
                  class="menubar__button"
                  :class="{ 'is-active': isActive.italic() }"
                  @click="commands.italic"
                >
                  <b-icon icon="type-italic"></b-icon>
                </button>
                <button type="button"
                  class="menubar__button"
                  :class="{ 'is-active': isActive.underline() }"
                  @click="commands.underline"
                >
                  <b-icon icon="type-underline"></b-icon>  
                </button>
                <button type="button"
                  class="menubar__button"
                  :class="{ 'is-active': isActive.paragraph() }"
                  @click="commands.paragraph"
                >
                  p
                </button>
                <button type="button"
                  class="menubar__button"
                  :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                  @click="commands.heading({ level: 1 })"
                >
                  <b-icon icon="type-h1"></b-icon>  
                </button>
                <button type="button"
                  class="menubar__button"
                  :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                  @click="commands.heading({ level: 2 })"
                >
                  <b-icon icon="type-h2"></b-icon>  
                </button>
                <button type="button"
                  class="menubar__button"
                  :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                  @click="commands.heading({ level: 3 })"
                >
                  <b-icon icon="type-h3"></b-icon>  
                </button>
                <button type="button"
                  class="menubar__button"
                  :class="{ 'is-active': isActive.bullet_list() }"
                  @click="commands.bullet_list"
                >
                  <b-icon icon="list-ul"></b-icon>
                </button>
                <button type="button"
                  class="menubar__button"
                  :class="{ 'is-active': isActive.ordered_list() }"
                  @click="commands.ordered_list"
                >
                  <b-icon icon="list-ol"></b-icon>
                </button>
                <button type="button"
                  class="menubar__button"
                  @click="commands.undo"
                >
                  <b-icon icon="arrow90deg-left"></b-icon>
                </button>
                <button type="button"
                  class="menubar__button"
                  @click="commands.redo"
                >
                  <b-icon icon="arrow90deg-right"></b-icon>
                </button>
<!-- End of Buttons -->
              </div>  
            </editor-menu-bar>
<!-- End of EditorMenu -->
<!-- Begin EditorContent -->
            <div class="editorContent mb-1">
              <editor-content id="editor__content" :editor="editor"/> 
            </div>
          </div>
        </b-col>
      </b-form-row>
<!-- Notes end, image input begins -->
        <ImageInput v-if="recipe" :formPictures=form.pictures :existingPictures=recipe.images.edges 
          :recipeId=recipeId :darkMode=darkMode></ImageInput>
        <ImageInput v-if="!recipe" :formPictures=form.pictures :darkMode=darkMode></ImageInput>
<!-- Image input ends, submit begins -->
      <b-form-row class="mb-3">
        <b-col > 
          <!-- empty column to offset submit block-->
        </b-col>
        <b-col cols="10">
          <b-button type="submit" block variant="success" >Submit</b-button>
        </b-col>
      </b-form-row>
<!-- Submit ends, Cancel begins -->
      <b-form-row>
        <b-col>
          <!-- empty column to offset cancel block-->
        </b-col>
        <b-col cols="*">
          <b-button type="reset" variant="danger" size="sm">Cancel</b-button>
        </b-col>
      </b-form-row>
    </b-form>
  </b-container>
</template>

<script>
import ImageInput from '../components/ImageInput.vue'
import gql from 'graphql-tag'
import { GET_ALL_RECIPES, GET_CATEGORIES } from './Home.vue'
import { GET_ONE_RECIPE } from './Recipe.vue'

import { Editor, EditorContent, EditorMenuBar, Extension } from 'tiptap'
import { insertText } from 'tiptap-commands'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from 'tiptap-extensions'

/**
 * GraphQL query for creating a new recipe entry
 */
export const SUBMIT_RECIPE = gql`
mutation SubmitRecipe($input: CreateRecipeInput!){
  createRecipe (input:$input) {
    recipe {
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
  }
}
`

/**
 * GraphQL query to update a recipe. Requires at least an ID.
 */
export const UPDATE_RECIPE = gql`
mutation UpdateRecipe($input: UpdateRecipeInput!){
  updateRecipe (input: $input) {
    recipe {
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
  }
}
`

/** 
 * GraphQL Query to delete a recipe
 */
export const DELETE_RECIPE = gql`
mutation DeleteRecipe($input: DeleteRecipeInput!){
  deleteRecipe (input: $input) {
    ok
  }
}
`

export default {
  name: 'NewRecipe',
  props: ['darkMode', 'recipeId'],
  components: {
    EditorContent,
    EditorMenuBar,
    ImageInput
  },
  data () {
    return {
      form: {
        title: '',
        category: null,
        recipeType: null,
        notes: '',
        rating: 0,
        web: {
          link: ''
        },
        book: {
          title: '',
          page: 0,
          picture: null
        },
        pictures: [
          { 
            id: 0,
            value: null
          }
        ]
      },
      recipeTypes: ['Book', 'Website'],
      allRecipes: [],
      recipeCategories: [],
      error: null,
      editor: null
    }
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
        ],
      nativeExtensions: [
        new class extends Extension {
          keys() {
            return {
              Tab () {
                insertText('    ')
              }
            }
          }
        }
      ],
      content: `<p>Enter notes here</p>`,
      onUpdate: ({ getHTML}) => {
        this.form.notes = getHTML()
      }
    })
  },
  methods: {
    async onSubmit() {
      // Create a list of images to send to server
      var recipeImages = []
      this.form.pictures.forEach(image => recipeImages.push(image.value))
      console.log("submitted edit recipe")
      var currentRecipeId = this.recipeId;

      if (!this.recipeId) { // Not editing recipe, submit new one
        // submit mutation request
        await this.$apollo.mutate({
          mutation: SUBMIT_RECIPE,
          variables: {
            input: {
              title: this.form.title,
              category: this.form.category,
              sourceType: this.form.recipeType,
              notes: this.form.notes,
              rating: this.form.rating,
              webLink: this.form.web.link,
              bookTitle: this.form.book.title,
              bookPage: this.form.book.page,
              bookImage: this.form.book.picture,
              recipeImages: recipeImages
            }
          },
          // eslint-disable-next-line
          update: (cache, { data: { createRecipe } }) => {
            // Read the data from our cache for this query.
            // eslint-disable-next-line
            try {
              const data = cache.readQuery({
                query: GET_ALL_RECIPES
              })
              var insertedRecipe = {node: createRecipe.recipe,
                __typename: 'RecipeObjectEdge'}
              data.allRecipes.edges.push(insertedRecipe)
              cache.writeQuery({
                query: GET_ALL_RECIPES,
                data
              })
              currentRecipeId = insertedRecipe.node.id;
              console.log(insertedRecipe)
              console.log(currentRecipeId)
            } catch (e) {
              console.log(JSON.stringify(e.message))
              console.error(e)
            }
          }
        })
      } else { // editing recipe, submit mutation
        // submit mutation request
        this.$apollo.mutate({
          mutation: UPDATE_RECIPE,
          variables: {
            input: {
              id: this.recipeId,
              title: this.form.title,
              category: this.form.category,
              sourceType: this.form.recipeType,
              notes: this.form.notes,
              rating: this.form.rating,
              webLink: this.form.web.link,
              bookTitle: this.form.book.title,
              bookPage: this.form.book.page,
              bookImage: this.form.book.picture,
              recipeImages: recipeImages
            }
          },
          // eslint-disable-next-line
          update: (cache, { data: { updateRecipe } }) => {
            // Read the data from our cache for this query.
            // eslint-disable-next-line
            try {
              const data = cache.readQuery({
                query: GET_ONE_RECIPE,
                variables: {
                  recipeId: this.recipeId
                }
              })
              var insertedRecipe = updateRecipe.recipe
              data.recipe = insertedRecipe
              cache.writeQuery({
                query: GET_ONE_RECIPE,
                variables: {
                  recipeId: this.recipeId
                },
                data
              })
            } catch (e) {
              console.log(JSON.stringify(e.message))
              console.error(e)
            }
          }
        })
      }
      this.$router.push({ name: "Recipe", params: {recipeId: currentRecipeId} })
    },
    onReset: function () {
      this.$router.push({ name: "Recipe", params: {recipeId: this.recipeId} })
    },
    deleteRecipe: function () {
      this.$apollo.mutate({
        mutation: DELETE_RECIPE,
        variables: {
          input: {
            id: this.recipeId
          }
        },
        // eslint-disable-next-line
        update: (cache, { data: { deleteRecipe } }) => {
          // Update the cache.
          if (deleteRecipe.ok) {
            try {
              const data = cache.readQuery({
                query: GET_ALL_RECIPES
              })
              const allRecipes = data.allRecipes.edges
              var recipeToDelete = 0;
              for (var i = 0; i < allRecipes.length; i++) {
                if (allRecipes[i].node.id === this.recipeId) {
                  recipeToDelete = i
                  break
                }
              }
              allRecipes.splice(recipeToDelete, 1)
              cache.writeQuery({
                query: GET_ALL_RECIPES,
                data
              })
              this.$router.push({ name: "Home"})
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
    isBook: function () {
      if (this.form.recipeType === 'Book') {
        return true
      } else {
        return false
      }
    },
    isWeb: function () {
      if (this.form.recipeType === 'Website') {
        return true
      } else {
        return false
      }
    },
    categoryNames: function() {
      if (!this.$apolloData.queries.recipeCategories.loading) {
        var categories = []
        console.log(this.recipeCategories)
        this.recipeCategories.edges.forEach(element => 
          categories.push(element.node.name)
        )
        console.log(categories)
        categories.sort()
        return categories
      }
      return []
    },
    /**
     * validate recipe link
     */
    validateRecipeWebLink: function () {
      // eslint-disable-next-line no-useless-escape
      var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
      var regex = new RegExp(expression);

      if (this.form.web.link.match(regex)) {
        return true; 
      } else {
        return false;
      }
    }
  },
  watch: {
    recipe: function (recipe) {
      if (recipe) {
        this.form.title = recipe.title
        this.form.category = recipe.recipeCategory.name
        this.form.rating = recipe.rating
        this.form.notes = recipe.notes
        this.form.recipeType = recipe.sourceType
        this.form.book.title = recipe.bookTitle
        this.form.book.page = recipe.bookPage
        this.form.book.picture = null
        this.form.web.link = recipe.webLink
        this.editor.setContent(this.form.notes)
      } else {
        this.form.title = ''
        this.form.rating = 0
        this.form.notes = '<p>Enter notes here (not visible)</p>'
        this.form.recipeType = ''
        this.form.book.title = ''
        this.form.book.page = 0
        this.form.book.picture = null
        this.form.web.link = ''
        this.editor.setContent(this.form.notes)
      }
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
        if (this.recipeId) {
          this.error = JSON.stringify(error.message)
        }
      }
    },
    recipeCategories: {
      query: GET_CATEGORIES,
      error (error) {
        this.error = JSON.stringify(error.message)
      }
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>

<style>
#NewRecipe {
  margin: auto; 
  margin-top: 50px;
  color: white;
}
.editorContent {
  background-color: rgba(245, 245, 220, 0);
}
.ProseMirror {
  background-color: white;
  color:black;
  max-height: 500px;
  min-height: 200px;
  border-radius: 4px;
  overflow: auto;
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 2%;
  padding-bottom: 2%;
}
.menubar__button {
  width:9%;
  border-radius: 4px;
  margin-left: 0px;
}
</style>
