<template>
  <div id="text-input-area">
    <div class="input-wrap" :class="{active: inputBorder}">
      <textarea
        class="real-input"
        :class="{disable : !editable}"
        type="text"
        rows="5"
        :value="dealValue"
        :readonly="editable ? false : 'readonly'"
        @input="updateValue($event.target.value)"
        @focus="focusInput"
        @blur="blurInput"/>
    </div>
  </div>
</template>

<script>
// 文本域输入组件
const NAME = 'text-input-area'

export default {
  name: NAME,
  props: {
    value: {
      default: ''
    },
    editable: {
      default: true
    }
  },
  data () {
    return {
      inputBorder: false,
      tagText: ''
    }
  },
  computed: {
    dealValue () {
      return this.value.replace(/<br\/>/g, '\r\n').replace(/&nbsp;/g, ' ')
    }
  },
  methods: {
    updateValue (value) {
      this.$emit('input', this.getValue(value))
    },
    focusInput () {
      this.inputBorder = true
      this.tagText = this.value
    },
    blurInput () {
      this.inputBorder = false
      let v = this.getValue(this.value)
      if (v !== this.tagText) {
        this.$emit('finish', v)
      }
    },
    getValue (value) {
      return value.replace(/\n|\r\n/g,"<br/>").replace(/ /g, '&nbsp;')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
