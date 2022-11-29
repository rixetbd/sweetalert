/*
  Code Block Web Component

  1) ✅ Basic styles (pulls `styles` global from another Pen)
  2) ✅ Syntax Highlight (assumes global `Prism`)
  3) ✅ Click to copy (Native JavaScript)
  4) ✅ Optional Line numbers (Prism feature)
  6) ✅ whitespace top/bottom trimming
  
  TODO
  [ ] Is there a way to avoid the <pre> in the custom element but still handle whitespace OK? Or is <pre> super magical and it's the only practial way to handle whitespace? Justin's doesn't seem to need it https://github.com/justinribeiro/code-block
  [ ] Implement line highlighting feature from Prism (had trouble with styles).
  [ ] Could this do entity escaping for you, so you didn't have to bother with that in the HTML? Or is that too weird because you wouldn't want the raw HTML sitting in the HTML to start with, in case the JS doesn't load? Maybe put HTML in <!-- comments
 --> or is that too weird because what if you want to show comments? 
*/

(function() {

    class CodeBlockComponent extends HTMLElement {
      
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
      }
      
      bindEvents() {
        const { shadowRoot } = this;
        const copyButton = shadowRoot.querySelector('#copy-button'); 
        copyButton.addEventListener("click", () => {
            this.copyCode();                   
        });
      }
      
      copyCode() {
        const { shadowRoot } = this;
        const codeNode = shadowRoot.querySelector('#code');  
        const range = document.createRange();  
        range.selectNode(codeNode);  
        window.getSelection().addRange(range); 
        try {  
          document.execCommand('copy');  
        } catch(err) {  
          console.warn('Oops, unable to copy');  
        } 
      }
      
      connectedCallback() {
        const { shadowRoot } = this;
        
        const styles = document.querySelector("#code-block-template").innerHTML;
        
        let lang = this.classList.value;
        lang = lang.replace("language-", "");
  
        const trimmed = this.innerHTML.trim();
        
        let lineNumbersClass = "";
        if (this.classList.contains("line-numbers")) {
          lineNumbersClass = "line-numbers";
        }
        
        // Line Highlighting would be something like this.
        
        // let lineHighlights = "";
        // if (this.dataset.line) {
        //   lineHighlights = this.dataset.line;
        // }
        
        // Plus data-line="${lineHighlights} on the <pre>
  
        const template = `
          <div>
            ${styles}
            <pre class="${lineNumbersClass} ${this.classList}" id="pre"><code id="code">${trimmed}</code><button id="copy-button">Copy</button></pre>
          </div>
        `;
  
        const placeholder = document.createElement('div');
        placeholder.insertAdjacentHTML('afterbegin', template);
  
        const node = placeholder.firstElementChild;
  
        shadowRoot.appendChild(node);
        
        // We could highlight it _before_ injecting with a different Prism function, but I'm not sure it does plugins then, like line numbers. Should check.
        Prism.highlightAllUnder(shadowRoot);
  
        this.bindEvents();
      }
    }
  
    customElements.define('code-block', CodeBlockComponent);
    
  })();