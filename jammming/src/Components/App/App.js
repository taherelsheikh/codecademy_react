import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [{id: 1, name: "name", artist: "artist", album: "album"},
                      {id: 2, name: "name2", artist: "artist2", album: "album2"},
                      {id: 3, name: "name3", artist: "artist3", album: "album3"}],
      playlistName: "jammming playlist",
      playlistTracks: [{id: 1, name: "name", artist: "artist", album: "album"},
                       {id: 2, name: "name2", artist: "artist2", album: "album2"}]
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }
  addTrack(track) {
    let exists = 0,
        playlist = this.state.playlistTracks;
    playlist.forEach(object => {
      if (track.id === object.id) {
        exists = 1;
      }
    });
    if (!exists) {
      playlist.push(track);
      this.setState({playlistTracks: playlist});
    }
  }
  removeTrack(track) {
    let index = 0,
        playlist = this.state.playlistTracks;
    playlist.forEach(object => {
      if (track.id === object.id) {
        playlist.splice(index, 1);
      } else {
        index++;
      }
    });
      this.setState({playlistTracks: playlist});
    }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults} />
            <Playlist onRemove={this.removeTrack} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
