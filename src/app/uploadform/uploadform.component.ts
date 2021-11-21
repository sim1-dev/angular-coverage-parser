import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver'

@Component({
  selector: 'app-uploadform',
  templateUrl: './uploadform.component.html',
  styleUrls: ['./uploadform.component.scss']
})
export class UploadformComponent implements OnInit {

  @ViewChild('uploadbtn', { static: true })
  btnRef: ElementRef;
  get uploadbtn(): HTMLCanvasElement { return this.btnRef.nativeElement; }

  disabled = true
  uploadForm: FormGroup;
  fileToUpload: File;
  reader :any = new FileReader()
  parsed :any = []
  fileName = "Select your coverage.json file..."

  constructor(private elementRef: ElementRef) { 
    this.uploadForm = new FormGroup({
      file: new FormControl('', [
        Validators.required,
        Validators.pattern("/Coverage/")
      ]),
    });
  }

  ngOnInit(): void {
  }

  async handleFileInput(target: any) {
    if(target.files[0].name.toLowerCase().startsWith("coverage") && target.files[0].name.toLowerCase().endsWith(".json")) {
      this.fileName = target.files[0].name
      this.fileToUpload = target.files[0]
      this.disabled = false
      this.uploadbtn.classList.remove("bg-secondary")
      this.uploadbtn.classList.add("bg-success")
    } else {
      this.uploadbtn.classList.remove("bg-success")
      this.uploadbtn.classList.add("bg-secondary")
      this.fileName = "Select your coverage.json file..."
      this.disabled = true
      alert("Wrong file type, try again")
    }
}

  parse() {
    var zip = new JSZip()
    this.reader.readAsText(this.fileToUpload);
    console.log(this.reader)
    this.reader.onload = () => {
      var data = JSON.parse(this.reader.result as string);
        //console.log(data)
        data.forEach((element: { url: string; ranges: { start: any; end: any; }[]; text: string; }) => {
            if(!(element.url.split("/").pop().endsWith(".js"))) {

              let usedCode = '';
              element.ranges.forEach((range: { start: any; end: any; }) => {
                  usedCode += element.text.substring(range.start, range.end); 
              })

              if(usedCode != '')
                this.parsed.push(usedCode)

              //console.log(this.parsed[this.parsed.length - 1])
              //console.log("Parsed File "+element.url)
              this.addToZip(new Blob([this.parsed[this.parsed.length - 1]], {type : 'text/css'}), element.url.split("/").pop(), zip)

            }
        });
        this.downloadZip(zip)
      };
  }

  addToZip(blobfile: any, filename: any, zip) {
    zip.file(filename, blobfile)
  }

  downloadZip(zip) {
    zip.generateAsync({type:"blob"}).then(function(content) {
      var date = new Date()
      var dateString = date.getFullYear() + "_" + (date.getMonth() + 1) + "_" + date.getDate() + "_" +  date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds();
      FileSaver.saveAs(content, "coverage_export_"+dateString+".zip");
  });
  }

}
