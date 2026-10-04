import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideSignalFormsConfig, FormField } from '@angular/forms/signals';
import { provideQuillConfig } from 'ngx-quill';

/*
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],
  ['link', 'image', 'video', 'formula'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];
*/

const toolbarOptions = [

  [{ 'header': [1, 2, 3, false] }],

  ['bold', 'italic', 'underline'],        // toggled buttons
  ['link'],

  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent


  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme

  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(withXhr()), 
    importProvidersFrom(NgbModule),
    provideSignalFormsConfig({
      classes: {
        "is-invalid": (formField) => formField.state().invalid() && formField.state().dirty()
      }
    }),
    provideQuillConfig({
      modules: {
        syntax: false,
        toolbar: toolbarOptions
      }
    })
  ]
};

