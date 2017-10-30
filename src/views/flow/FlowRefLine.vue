<script>
export default {
  name: 'refLine',
  data(){
    return{
      options:{
        gap:''
      }
    }
  },
  render(h) {
    let lines = {
      xt: null,
      xc: null,
      xb: null,
      yl: null,
      yc: null,
      yr: null
    };

    return <div class=".ref-line" />;
  }
};
</script>

<style scoped>
.ref-line {
  opacity: 0.7;
  position: absolute;
  background: #4daeff;
  z-index: 99999;
}
.ref-line-h {
  width: 100%;
  height: 1px;
  left: 0;
}
.ref-line-v {
  width: 1px;
  height: 100%;
  top: 0;
}
</style>