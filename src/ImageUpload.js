import React from 'react';
import axios from 'axios';

export default class ImageUpload extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            imageUploadVisibile:true
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)

    }

    handleChange(e){
        var myFile= e.target.files[0] /* this is the file that we got from upload, [0]index is because it's the first, there could be many*/
        this.setState({ file:myFile })
    }
    handleSubmit(){
        const formData = new FormData();
        formData.append('file',this.state.file)
        axios.post('/upload',formData
        ).then((result) =>{
            if(result.data.success){
                this.props.updateImg(result.data.url)
                // this.setState({imageUploadVisibile:!this.imageUploadVisibile})
            }
        })
    }
    render(){
        return(
            <div className="imageupload">
                <input id="file" type="file"  onChange={this.handleChange} />
                <label  id="upload-button" htmlFor="file"> Choose a file</label>
                <p onClick={this.props.onClick} id="close-button">&#10006;</p>
                {<button onClick={() => this.handleSubmit()}>Upload</button>}
            </div>
        )
    }
}
