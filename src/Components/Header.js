import React, { Component } from "react";
import Logo from "./Logo";

class Header extends Component {
  render() {
    if (this.props.data) {
      var name = this.props.data.name;
      var occupation = this.props.data.occupation;
      var description = this.props.data.description;
      var city = this.props.data.address.city;
      var networks = this.props.data.social.map(function (network) {
        return (
          <li key={network.name}>
            <a href={network.url}>
              <i className={network.className}></i>
            </a>
          </li>
        );
      });
    }

    return (
      <header id="home">
        <nav id="nav-wrap">
          <a className="mobile-btn" href="#nav-wrap" title="Show navigation">
            Show navigation
          </a>
          <a className="mobile-btn" href="#home" title="Hide navigation">
            Hide navigation
          </a>

          <ul id="nav" className="nav">
            <li className="current">
              <a className="smoothscroll" href="#home">
                {this.props.language === "EN" ? "Home" : "Inicio"}
              </a>
            </li>
            <li>
              <a className="smoothscroll" href="#about">
                {this.props.language === "EN" ? "About" : "Sobre Nosotros"}
              </a>
            </li>
            <li>
              <a className="smoothscroll" href="#testimonials">
                {this.props.language === "EN" ? "Testimonials" : "Testimonios"}
              </a>
            </li>
          </ul>

          <button
            onClick={this.props.toggleLanguage}
            style={{
              position: "absolute",
              right: "20px",
              top: "15px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "3rem",
              color: "white",
            }}
          >
            {this.props.language === "EN" ? "ES" : "EN"}
          </button>
        </nav>

        <div className="row banner">
          <Logo />
          <div className="banner-text">
            <h1 className="responsive-headline">{name}.</h1>
            <h3>
              {this.props.language === "EN"
                ? `We are a ${city} based ${occupation}. ${description}.`
                : `Somos una ${occupation} con sede en ${city}. ${description}.`}
            </h3>
            <hr />
            <ul className="social">{networks}</ul>
          </div>
        </div>

        <p className="scrolldown">
          <a className="smoothscroll" href="#about">
            <i className="icon-down-circle"></i>
          </a>
        </p>
      </header>
    );
  }
}

export default Header;
