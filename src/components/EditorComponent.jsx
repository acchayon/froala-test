// import React, { Component } from 'react';
// import 'froala-editor/css/froala_editor.pkgd.min.css';
// import 'froala-editor/css/froala_style.min.css';
// import 'froala-editor/js/plugins.pkgd.min.js';
// import FroalaEditorComponent from 'react-froala-wysiwyg';
// import jsPDF from 'jspdf';

// class EditorComponent extends Component {
//   constructor(props) {
//     super(props);
//     this.editorRef = React.createRef();
//   }

//   handleModelChange = (model) => {
//     // Do something with the updated editor content (model)
//     console.log(model);
//   };

//   handleSaveAsPDF = () => {
//     const doc = new jsPDF();
//     const editorContent = this.editorRef.current.editor.html.get();

//     doc.html(editorContent, {
//       callback: function (doc) {
//         doc.save('editor_content.pdf');
//       },
//       x: 10,
//       y: 10,
//     });
//   };

//   handleSaveAsHTML = () => {
//     const editorContent = this.editorRef.current.editor.html.get();

//     const blob = new Blob([editorContent], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'editor_content.html';
//     a.click();

//     // Clean up the URL
//     URL.revokeObjectURL(url);
//   };

//   handleSaveAsText = () => {
//     const editorContent = this.editorRef.current.editor.el.innerText;

//     const blob = new Blob([editorContent], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'editor_content.txt';
//     a.click();

//     // Clean up the URL
//     URL.revokeObjectURL(url);
//   };

//   render() {
//     return (
//       <div>
//         <FroalaEditorComponent
//           tag='textarea'
//           config={{
//             key: 'YOUR_FROALA_LICENSE_KEY',
//             // Other Froala Editor configuration options
//           }}
//           onModelChange={this.handleModelChange}
//           ref={this.editorRef}
//         />
//         <button onClick={this.handleSaveAsPDF}>Save as PDF</button>
//         <button onClick={this.handleSaveAsHTML}>Save as HTML</button>
//         <button onClick={this.handleSaveAsText}>Save as Text</button>
//       </div>
//     );
//   }
// }

// export default EditorComponent;


import React, { Component } from 'react';
import FroalaEditorComponent from 'react-froala-wysiwyg';
import Docxtemplater from 'docxtemplater';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

class EditorComponent extends Component {
  constructor(props) {
    super(props);
    this.editorRef = React.createRef();
  }

  handleSaveAsDOCX = () => {
    const editorContent = this.editorRef.current.editor.html.get();

    const template = new Docxtemplater();
    template.loadZip(JSZip.loadAsync(this.getTemplate()));
    template.setData({ content: editorContent });

    try {
      template.render();
    } catch (error) {
      console.error('Error rendering template:', error);
      return;
    }

    const out = template.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    saveAs(out, 'editor_content.docx');
  };

  getTemplate() {
    return `
      <docxtemplater>
        <content>{{content}}</content>
      </docxtemplater>
    `;
  }

  render() {
    return (
      <div>
        <FroalaEditorComponent
          tag='textarea'
          config={{
            key: 'YOUR_FROALA_LICENSE_KEY',
            // Other Froala Editor configuration options
          }}
          ref={this.editorRef}
        />
        <button onClick={this.handleSaveAsDOCX}>Save as DOCX</button>
      </div>
    );
  }
}

export default EditorComponent;
