import React, { Component } from "react";
import $ from "jquery";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import About from "./Components/About";
import Resume from "./Components/Resume";
import Contact from "./Components/Contact";
import Testimonials from "./Components/Testimonials";
import Portfolio from "./Components/Portfolio";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foo: "bar",
      resumeData: {},
      language: "EN",
    };
  }

  getResumeData(language = "EN") {
    const file = language === "EN" ? "/resumeEN.json" : "/resumeES.json";

    $.ajax({
      url: file,
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ resumeData: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.log(err);
        alert(err);
      },
    });
  }

  componentDidMount() {
    this.getResumeData();
  }

  toggleLanguage = () => {
    const newLanguage = this.state.language === "EN" ? "ES" : "EN";
    this.setState({ language: newLanguage }, () =>
      this.getResumeData(newLanguage)
    );
  };

  render() {
    return (
      <div className="App">
        <Header
          data={this.state.resumeData.main}
          toggleLanguage={this.toggleLanguage}
          language={this.state.language}
        />
        <About
          data={this.state.resumeData.main}
          language={this.state.language}
        />

        {/* <Resume data={this.state.resumeData.resume} /> */}
        {/* <Portfolio data={this.state.resumeData.portfolio} /> */}
        <Testimonials data={this.state.resumeData.testimonials} />
        {/* <Contact data={this.state.resumeData.main}/> */}
        <Footer data={this.state.resumeData.main} />
      </div>
    );
  }
}

export default App;
