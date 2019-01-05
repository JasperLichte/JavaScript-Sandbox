import React, { Component } from 'react';
import styled from 'styled-components';

export default class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentState: 'break',
            sSinceStart: 0,
            running: false,
        };
        this.conf = {
            pressure_T: 60,
            break_T: 20,
        };
    }

    changePressureTime = s => {
        this.conf.pressure_T = s;
    }

    changeBreakTime = s => {
        this.conf.break_T = s;
    }

    start = () => {
        this.interval = setInterval(() => {
            if (this.state.currentState === 'break' && this.state.sSinceStart >= this.conf.break_T) {
                this.setState({
                    currentState: 'pressure',
                    sSinceStart: 0
                });
                // NEW PRESSURE STARTING
                return;
            }
            if (this.state.currentState === 'pressure' && this.state.sSinceStart >= this.conf.pressure_T) {
                this.setState({
                    currentState: 'break',
                    sSinceStart: 0
                });
                // PRESSURE ENDING
                return;
            }

            if (this.state.currentState === 'pressure' 
            && (
                this.state.sSinceStart >= (this.conf.pressure_T / 2 - 0.05) 
                && this.state.sSinceStart <= (this.conf.pressure_T / 2 + 0.05))
            ) {
                // HALF PRESSURE
            }

            this.setState({
                sSinceStart: this.state.sSinceStart + 0.025,
            });
        }, 25);
        this.setState({
            running: true
        });
    }

    stop = () => {
        clearInterval(this.interval);
        this.setState({
            running: false
        });
    }

    render() {
        return (
            <>
                <h1 className={this.state.currentState} id="time-heading" onClick={ () => {
                    if (this.state.running) {
                        this.stop();
                        return;
                    }
                    this.start();
                } }>{
                    this.state.running
                    ?   this.state.currentState === 'pressure'
                        ? Math.ceil(this.conf.pressure_T - this.state.sSinceStart)
                        : Math.ceil(this.conf.break_T - this.state.sSinceStart)
                    : 'Go!'
                }</h1>
                <ButtonWrapper>
                    <ButtonLabel>Belastung: </ButtonLabel>
                    <Button className={ this.conf.pressure_T === 40 && this.state.running && 'active' } onClick={ () => {this.changePressureTime(40)} }>40s</Button>
                    <Button className={ this.conf.pressure_T === 50 && this.state.running && 'active' } onClick={ () => {this.changePressureTime(50)} }>50s</Button>
                    <Button className={ this.conf.pressure_T === 60 && this.state.running && 'active' } onClick={ () => {this.changePressureTime(60)} }>60s</Button>
                    <br/>
                    <ButtonLabel>Pause: </ButtonLabel>
                    <Button className={ this.conf.break_T === 20 && this.state.running && 'active' } onClick={ () => {this.changeBreakTime(20)} }>20s</Button>
                    <Button className={ this.conf.break_T === 30 && this.state.running && 'active' } onClick={ () => {this.changeBreakTime(30)} }>30s</Button>
                    <Button className={ this.conf.break_T === 40 && this.state.running && 'active' } onClick={ () => {this.changeBreakTime(40)} }>40s</Button>
                </ButtonWrapper>
            </>
        )
    }
}
const ButtonWrapper = styled.div`
    display: inline-block;
    margin-left: 50%;
    transform: translateX(-50%);
`;
const ButtonLabel = styled.span`
    color: #999;
    display: block;
    width: 90px;
    margin-top: 6px;
`;
const Button = styled.button`
    padding: 0.5rem 0.75rem;
    margin: 0.125rem;
    border: 1px solid #777;
    background: transparent;
    color: #999;
`;
