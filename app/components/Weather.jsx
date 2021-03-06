import React from 'react';
import WeatherForm from 'WeatherForm';
import WeatherMessage from 'WeatherMessage';
import ErrorModal from 'ErrorModal';
import openWeatherMap from 'openWeatherMap';
import queryString from 'query-string';

class Weather extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      errorMsg: undefined,
      location: undefined,
      temp: undefined
    };
  };
  handleSearch = (loc) => {
    this.setState({
      isLoading: true,
      errorMsg: undefined
    });

    openWeatherMap.getData(loc)
    .then((data) => {
      this.setState({
        location: data.location,
        temp: data.temp,
        isLoading: false
      });
    }).catch((error) => {
      this.setState({
        isLoading: false,
        errorMsg: error.message
      });
    });
  };

  componentDidMount(){
    var locationObject = queryString.parse(this.props.location.search);
    var loc = locationObject.location;

    if (loc && loc.length > 0){
      this.handleSearch(loc);
      window.location.hash = '#/';
    }
  }

  componentWillReceiveProps(props){
    var locationObject = queryString.parse(props.location.search);
    var loc = locationObject.location;

    if (loc && loc.length > 0){
      this.handleSearch(loc);
      window.location.hash = '#/';
    }
  }

  render(){
    var {isLoading, temp, location, errorMsg} = this.state;

    var renderMessage = () =>{ //Same as function renderMessage(){
      if (isLoading){
        return (<h3  className="text-center">Fetching weather...</h3>);
      }  else if (temp && location){
        return <WeatherMessage location={location} temp={temp}/>
      }
    }

    var renderError = () =>{
      if (typeof errorMsg === "string"){
        return <ErrorModal msg={errorMsg} />
      }
    }

    return(
      <div>
        <h1 className="text-center pageTitle">Get Weather</h1>
        <WeatherForm onSearch={this.handleSearch}/>
        {renderMessage()}
        {renderError()}
      </div>
    )
  }
}

module.exports = Weather;
