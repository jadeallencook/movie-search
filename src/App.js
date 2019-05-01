import React, { Component } from 'react';
import './App.scss';

class App extends Component {

  constructor() {
    super();
    this.state = {
      results: [],
      query: '',
      typing: 0,
      selected: 0,
      error: '',
      focused: false
    };
  }

  search() {
    fetch(`http://localhost:4200/?query=${this.state.query}`)
      .then(res => res.json())
      .then(json => {
        this.setState({
          ...this.state,
          results: json.results
        });
      }).catch(() => {
        this.setState({ 
          ...this.state, 
          error: 'Error: Server failed to respond (try "npm run server")' 
        });
        setTimeout(() => this.setState({ ...this.state, error: '' }), 4000);
      });
  }

  handler(event) {
    const query = (event) ? event.target.value : '';
    this.setState({
      ...this.state,
      query: query,
      typing: Date.now()
    });
    setTimeout(() => {
      const { typing } = this.state;
      if ((Date.now() - typing) > 850) this.search();
    }, 1000);
  }

  render() {
    return (
      <div className="App">
        <h1>Movie Search</h1>
        <input
          placeholder="Search movie title..."
          className="search"
          value={this.state.query}
          onChange={this.handler.bind(this)}
          onFocus={() => this.setState({ ...this.state, focused: true })}
          onBlur={() => this.setState({ ...this.state, focused: false })}
          onKeyDown={event => {
            let num = 0, focused = true;
            const { keyCode } = event;
            if (keyCode === 40) {
              num = (this.state.selected < this.state.results.length) ? this.state.selected + 1 : 0;
            } else if (keyCode === 38) {
              num = (!this.state.selected) ? this.state.results.length : this.state.selected - 1;
            } else if (keyCode === 13) {
              focused = false;
            }
            this.setState({
              ...this.state,
              selected: num,
              focused: focused,
              query: (this.state.results[num - 1]) ? this.state.results[num - 1].title : this.state.query
            });
          }}
        />
        {
         (this.state.focused) ? (
            <ul id="results">
              {
                (this.state.results.length) ? 
                this.state.results.map((result, i) => (
                    <li 
                      onMouseDown={() => {
                        this.setState({ 
                          ...this.state, 
                          query: result.title,
                          focused: false
                        });
                      }}
                      className={(this.state.selected - 1 === i) ? 'selected' : null}
                      key={result.id}
                    >{result.title}</li>
                  )) : <li>No suggestions...</li>
              }
            </ul>
          ) : null
        }
        {(this.state.error) ? (<span className="error">{this.state.error}</span>) : null}
      </div>
    );
  }
}

export default App;
