import React, { Component } from 'react'
import EditorJS from '@editorjs/editorjs'; 
import Header from '@editorjs/header'; 
import List from '@editorjs/list'; 

const editor = new EditorJS({ 

  holder: 'editorjs', 

  /** 
   * Available Tools list. 
   * Pass Tool's class or Settings object for each Tool you want to use 
   */ 
  tools: { 
    header: {
      class: Header, 
      inlineToolbar: ['link'] 
    }}

})



export default class Edit extends Component {
    render() {
        return (
            <div>
                {editor}
            </div>
        )
    }
}
