import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
var ConfigFile = require('../config');

class MyBookingsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookings: null,
            properties: [],
            isLoading: true,
            date: new Date(),
        };
        this.init = this.init.bind(this);
        this.init();
    }

    async init() {
        // var today = new Date();
        // var dd = String(today.getDate()).padStart(2, '0');
        // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        // var yyyy = today.getFullYear();
        // today = mm + '/' + dd + '/' + yyyy;
        var req = ConfigFile.Config.server + 'booking/UID';
        await fetch(req, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then((response) => {
            response.json().then( async (data) => {
                if (data['bookings'] != null) {
                    var propertiesList = {};
                    for (var i = 0; i < data['bookings'].length; i++) {
                        var propUrl = ConfigFile.Config.server + 'advertising/' + data['bookings'][i].property_id;
                        await fetch(propUrl, {
                            method: "GET",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                        }).then(async (response) => {
                            await response.json().then((propertyData) => {
                                if (propertyData && propertyData.property_id){
                                    propertiesList[propertyData.property_id] = propertyData;
                                }
                            })
                        });
                    }
                    this.setState({
                        bookings: data['bookings'],
                        properties: propertiesList,
                        isLoading : false
                    });
                }
            });
        });
    }

    async handleCancellation(BID) {
        var userUrl = `${ConfigFile.Config.server}booking/UID`;
        var cancelUrl = `${ConfigFile.Config.server}booking/delete/` + BID;
        await fetch(cancelUrl ,{
            method: "GET",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        .then(result => {
            console.log(result.json());
            // this.setState({bookings: null});
        }).then(() => fetch(userUrl, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then((response) => {
            response.json().then(async (data) => {
                this.setState({
                    bookings: data['bookings'],
                    isLoading :false
                });
            });
        })
        );
    }

    propertyDetailsFunc = async (PID) => {
        var propUrl = `${ConfigFile.Config.server}advertising/` + PID;
        // console.log("propertyDetailsFunc: ");
        await fetch(propUrl, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then((response) => {
            response.json().then((data) => {
                // console.log(data.images[0], data.name, data.address, data.buildingType);
                return (
                    <div>
                        <div style={{width: "35%"}}>
                            <img src={data.images[0]} alt="image of property" style={{width:'300px', height:'200px', float: 'left', display: 'inline-block', padding: '4px'}}></img>
                        </div>
                        <div style={{width:'58%', display: 'inline-block', padding: '5px', paddingLeft: '15px'}}>
                            <div style={{float: 'left', display: 'inline-block'}}>
                                <h4 style={{margin: '0px'}}>{data.name}</h4>
                            </div>
                            <div style={{clear:'both', display: 'flex', paddingTop: '5px', paddingBottom: '5px'}}>
                                <p style={{margin: '0px'}}>{data.buildingType}</p>
                            </div>
                            <hr style={{margin: "2px"}}></hr>
                            <div style={{clear:'both', display: 'flex', paddingTop: '5px', paddingBottom: '5px'}}>
                                <FontAwesomeIcon icon={faMapMarkerAlt} size="lg"/>
                                <p style={{margin: '0px', paddingLeft: "5px"}}>{data.address}</p>
                            </div>
                        </div>
                    </div>
                );
            });
        });
    }

    render() {
        return (
            <div className="homepage-div">
                <h1>Your Trips</h1>
                <div>
                    <ul style={{listStyleType: 'none', padding: "0px"}}>
                        {this.state.isLoading ?
                        <h4>Loading...</h4> :
                        this.state.bookings.length === 0 ?
                        <h2>No Trips</h2> :
                        this.state.bookings.map(booking => (
                        <li key={booking['property_id']}>
                            {/* {console.log(booking)} */}
                            {/* {console.log(this.state.properties[booking['property_id']])} */}
                            {/* {console.log(booking['property_id'])} */}
                            <div style={{width:'90%', margin: '50px'}}>
                                <div className="mini-desc">
                                    <div style={{textAlign: 'center', display: 'block', border: '1.5px solid grey', borderRadius: '5px', width: "50%"}}>
                                        <div style={{width: "35%"}}>
                                            {this.state.properties[booking['property_id']] ?
                                                <img src={this.state.properties[booking['property_id']].images[0]} alt="image of property" style={{width:'300px', height:'200px', float: 'left', display: 'inline-block', padding: '4px'}}></img>
                                                : null
                                            }
                                        </div>
                                        <div style={{width:'58%', display: 'inline-block', padding: '5px', paddingLeft: '15px'}}>
                                            <div style={{float: 'left', display: 'inline-block'}}>
                                                {this.state.properties[booking['property_id']] ?
                                                    <h4 style={{margin: '0px'}}>{this.state.properties[booking['property_id']].name}</h4>
                                                    : null
                                                }
                                            </div>
                                            <div style={{clear:'both', display: 'flex', paddingTop: '5px', paddingBottom: '5px'}}>
                                                {this.state.properties[booking['property_id']] ?
                                                    <p style={{margin: '0px'}}>{this.state.properties[booking['property_id']].buildingType}</p>
                                                    : null
                                                }
                                            </div>
                                            <hr style={{margin: "2px"}}></hr>
                                            <div style={{clear:'both', display: 'flex', paddingTop: '5px', paddingBottom: '5px'}}>
                                                <FontAwesomeIcon icon={faMapMarkerAlt} size="lg"/>
                                                {this.state.properties[booking['property_id']] ?
                                                    <p style={{margin: '0px', paddingLeft: "5px"}}>{this.state.properties[booking['property_id']].address}</p>
                                                    : null
                                                }
                                            </div>
                                        </div>
                                        <div style={{width:'30%', display: 'inline-block', padding: '10px'}}>
                                            <p style={{marginTop: '55px'}}>Check In: {booking['startDate']}</p>
                                            <p style={{marginTop: '55px'}}>Check Out: {booking['endDate']}</p>
                                            <p style={{marginTop: '55px'}}>Total Price: ${booking['price']}</p>
                                        </div>
                                        {Date.parse(booking['endDate']) < Math.round(new Date()) ?
                                        <Link to={'/submitReview/' + booking['property_id'] + '/' + booking['booking_id']}>
                                            <Button variant="contained" style={{width: "120px"}}>
                                                Write Review
                                            </Button>
                                        </Link>:
                                        <Button variant="contained" style={{width: "120px"}} onClick={() => this.handleCancellation(booking['booking_id'])}>
                                            Cancel Booking
                                        </Button>}
                                    </div>
                                </div>
                            </div>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

export default MyBookingsPage;