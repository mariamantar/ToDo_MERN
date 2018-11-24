import React from 'react';
import TextField from '@material-ui/core/TextField';

export default class Form extends React.Component {
    state = {
        text: '',
    };

    handleChange = e => {
        //newText will store the text user is currently typing in
        const newText = e.target.value;
        this.setState({
            text: newText
        });
    };

    //when the user click enter, we want to save item to DB
    handleKeyDown = e => {
        console.log(e);
        if (e.key === 'Enter') {
            //sumbit is passed down from App.js
            this.props.submit(this.state.text);
            this.setState({
                text: ''
            });
        }
    };

    render() {
        const { text } = this.state;
        return (
            <TextField
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                label="To Do..."
                margin="normal"
                value={text}
                fullWidth
            />
        )
    };
};
