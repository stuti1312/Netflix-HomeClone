import React from "react";
import Logo from "./Logo.js";
import "./App.css";

/// ALL COMPONENTS IN ONE //

// Container
var App = React.createClass({
  apiKey: "a4e58d56fe8690c89ebed28c6816ff3f",
  getInitialState: function () {
    return { searchTerm: "", searchUrl: "" };
  },
  handleKeyUp: function (e) {
    if (e.key === "Enter" && this.state.searchTerm !== "") {
      var searchUrl =
        "search/multi?query=" +
        this.state.searchTerm +
        "&api_key=" +
        this.apiKey;
      this.setState({ searchUrl: searchUrl });
    }
  },

  handleChange: function (e) {
    this.setState({ searchTerm: e.target.value });
  },
  randomNumber: function () {
    return Math.floor(Math.random() * 10 + 1);
  },
  render: function () {
    return (
      <div>
        <header className="Header">
          <Logo />
          <Navigation />
          <div id="search" className="Search">
            <input
              onKeyUp={this.handleKeyUp}
              onChange={this.handleChange}
              type="search"
              placeholder="Search for a title..."
              value={this.state.searchTerm}
            />
          </div>
          <UserProfile />
        </header>
        <Hero />
        <TitleList title="Search Results" url={this.state.searchUrl} />
        <TitleList
          title="Top TV picks for Stuti"
          url={`discover/tv?sort_by=popularity.desc&page=${this.randomNumber()}`}
        />
        <TitleList
          title="Trending now"
          url={`discover/movie?sort_by=popularity.desc&page=${this.randomNumber()}`}
        />
        <TitleList
          title="Comedy magic"
          url={`genre/35/movies?sort_by=popularity.desc&page=${this.randomNumber()}`}
        />
        <TitleList
          title="Sci-Fi greats"
          url={`genre/878/movies?sort_by=popularity.desc&page=${this.randomNumber()}`}
        />
        <TitleList
          title="Most watched in Horror"
          url={`genre/27/movies?sort_by=popularity.desc&page=${this.randomNumber()}`}
        />
      </div>
    );
  },
});

// Navigation
var Navigation = React.createClass({
  render: function () {
    return (
      <div id="navigation" className="Navigation">
        <nav>
          <ul>
            <li>Browse</li>
            <li>My list</li>
            <li>Top picks</li>
            <li>Recent</li>
          </ul>
        </nav>
      </div>
    );
  },
});

// User Profile
var UserProfile = React.createClass({
  render: function () {
    return (
      <div className="UserProfile">
        <div className="User">
          <div className="name">Stuti Singhal</div>
          {/* <div className="image"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/profile/profile-512_1.jpg" alt="profile" /></div> */}
        </div>
      </div>
    );
  },
});

// Hero //
var Hero = React.createClass({
  render: function () {
    return (
      <div
        id="hero"
        className="Hero"
        style={{
          backgroundImage:
            "url(https://images3.alphacoders.com/103/1033561.jpg)",
        }}
      >
        <div className="content">
          <img
            className="logo"
            src="https://www.seekpng.com/png/detail/106-1060901_version-john-wick-movie-logo.png"
            alt="Version - John Wick Movie"
          />
          <h2>John Wick: Chapter 3 – Parabellum</h2>
          <p>
            John Wick is on the run after killing a member of the international
            assassins' guild, and with a $14 million price tag on his head, he
            is the target of hit men and women everywhere.
          </p>
          <div className="button-wrapper">
            <HeroButton primary={true} text="Watch now" />
            <HeroButton primary={false} text="+ My list" />
          </div>
        </div>
        <div className="overlay"></div>
      </div>
    );
  },
});

// Hero Button
var HeroButton = React.createClass({
  render: function () {
    return (
      <a href="#" className="Button" data-primary={this.props.primary}>
        {this.props.text}
      </a>
    );
  },
});

// Title List //
// Title List Container

var TitleList = React.createClass({
  apiKey: "a4e58d56fe8690c89ebed28c6816ff3f",
  getInitialState: function () {
    return { data: [], mounted: false };
  },
  loadContent: function () {
    var requestUrl =
      "https://api.themoviedb.org/3/" +
      this.props.url +
      "&api_key=" +
      this.apiKey;
    fetch(requestUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({ data: data });
      })
      .catch((err) => {
        console.log("There has been an error");
      });
  },
  componentWillReceiveProps: function (nextProps) {
    if (nextProps.url !== this.props.url && nextProps.url !== "") {
      this.setState({ mounted: true, url: nextProps.url }, () => {
        this.loadContent();
      });
    }
  },
  componentDidMount: function () {
    if (this.props.url !== "") {
      this.loadContent();
      this.setState({ mounted: true });
    }
  },
  render: function () {
    var titles = "";
    if (this.state.data.results) {
      titles = this.state.data.results.map(function (title, i) {
        if (i < 10) {
          var name = "";
          var backDrop =
            "http://image.tmdb.org/t/p/original" + title.backdrop_path;
          if (!title.name) {
            name = title.original_title;
          } else {
            name = title.name;
          }

          return (
            <Item
              key={title.id}
              title={name}
              score={title.vote_average}
              overview={title.overview}
              backdrop={backDrop}
            />
          );
        } else {
          return <div key={title.id}></div>;
        }
      });
    }

    return (
      <div
        ref="titlecategory"
        className="TitleList"
        data-loaded={this.state.mounted}
      >
        <div className="Title">
          <h1>{this.props.title}</h1>
          <div className="titles-wrapper">{titles}</div>
        </div>
      </div>
    );
  },
});

// Title List Item
var Item = React.createClass({
  render: function () {
    return (
      <div
        className="Item"
        style={{ backgroundImage: "url(" + this.props.backdrop + ")" }}
      >
        <div className="overlay">
          <div className="title">{this.props.title}</div>
          <div className="rating">{this.props.score} / 10</div>
          <div className="plot">{this.props.overview}</div>
          <ListToggle />
        </div>
      </div>
    );
  },
});

// ListToggle
var ListToggle = React.createClass({
  getInitialState: function () {
    return { toggled: false };
  },
  handleClick: function () {
    if (this.state.toggled === true) {
      this.setState({ toggled: false });
    } else {
      this.setState({ toggled: true });
    }
  },
  render: function () {
    return (
      <div
        onClick={this.handleClick}
        data-toggled={this.state.toggled}
        className="ListToggle"
      >
        <div>
          <i className="fa fa-fw fa-plus"></i>
          <i className="fa fa-fw fa-check"></i>
        </div>
      </div>
    );
  },
});

export default App;
