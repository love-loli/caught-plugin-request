export function ajaxInterceptor() {
  if (!XMLHttpRequest) throw new Error("XMLHttpRequest is not supported")
  const oldXMLHttpRequest = XMLHttpRequest
  window.XMLHttpRequest = function(){
    var actual = new oldXMLHttpRequest();
    var self = this;
    this.onreadystatechange = null;
    // this is the actual handler on the real XMLHttpRequest object
    actual.onreadystatechange = function () {
      if (this.readyState == 1) {
      onLoadStart.call(this);
      } else if (this.readyState == 4) {
        if(this.status==200)
           onLoadEnd.call(this);
        else{
           onError.call(this);
        }
      }
     if (self.onreadystatechange) {
        return self.onreadystatechange();
      }
  }
}
