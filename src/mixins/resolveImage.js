export default {
  data () {
    return {
      defaultCardImages: {
        Breakfast: "defaultCardImageBreakfast.png",
        Bread: "defaultCardImageBread.png",
        /** 
        defaultCardImageSoup: "",      
        defaultCardImageSweets: "",
        defaultCardImageMain: "",
        defaultCardImageSide: "",
        defaultCardImageDip: "", 
        */
      }
    }
  },
  methods: {
    /**
     * Get image url from image filename.
     * @param {String} filename 
     */
    resolveImageUrl: function (filename) {
      return this.$hostname + 'image/' + filename;
    },
    /**
     * Get resized image from filename. The image will fit
     * inside the height and width provided. This does not 
     * change the image's aspect ratio or crop the image.
     * @param {String} filename 
     * @param {Number} height 
     * @param {Number} width 
     */
    resolveImageUrlWidth: function (filename, height, width) {
      return this.$hostname + 'image/' + filename + '/h+w/' + height + '/' + width
    }
  }
};