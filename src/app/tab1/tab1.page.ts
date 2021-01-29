import { stringify } from '@angular/compiler/src/util';
import { Component } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private speechRecognition: SpeechRecognition) { }

  words: string = '';

  public VoiceToText() {


    // Start the recognition process
    this.speechRecognition.startListening()
      .subscribe(
        (matches: string[]) => {this.words += matches.join(' ')},
        (onerror) => console.log('error:', onerror)
      )

    // Stop the recognition process (iOS only)
    //this.speechRecognition.stopListening()

   
  }
}
