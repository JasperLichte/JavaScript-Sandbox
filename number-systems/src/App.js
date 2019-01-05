import React, { Component } from 'react';
import styled from 'styled-components';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      mode: 10,
      to: 2,
      input: 0,
    };
    
    let ConvertBase = function (num) {
      return {
          from : function (baseFrom) {
              return {
                  to : function (baseTo) {
                      return parseInt(num, baseFrom).toString(baseTo);
                  }
              };
          }
      };
    };      
    // binary to decimal
    ConvertBase.bin2dec = function (num) {
      const str = num + '';
      let res = 0;
      for (let i = 0; i < str.length; i++) {
        const digit = str.charAt(i) * 1;
        if (digit === 1) {
          res += Math.pow(2, i);
        }
      }
      return res ? res : 0;
    };    
    // binary to hexadecimal
    ConvertBase.bin2hex = function (num) {
        return ConvertBase(num).from(2).to(16);
    };   
    // decimal to binary
    ConvertBase.dec2bin = function (num) {
      let bin = [];
      while (num > 0) {
        bin.unshift(num % 2);
        num >>= 1;
      }
      let res = bin.join('');
      return res ? res : 0;
    };    
    // decimal to hexadecimal
    ConvertBase.dec2hex = function (num) {
        return ConvertBase(num).from(10).to(16);
    };    
    // hexadecimal to binary
    ConvertBase.hex2bin = function (num) {
        return ConvertBase(num).from(16).to(2);
    };    
    // hexadecimal to decimal
    ConvertBase.hex2dec = function (num) {
        return ConvertBase(num).from(16).to(10);
    };    
    this.ConvertBase = ConvertBase;

  }

  componentDidMount() {
    this.calc(this.state);
  }

  render()  {
    return (
      <Body>
        <Wrapper>
          <Form>
              <TextInput 
                onChange={e => {
                  this.setState({input: e.target.value ? e.target.value : 0}, () => {
                    this.calc(this.state);
                  });
                }} 
                type="text" 
                placeholder={this.state.input} 
                autoFocus
              />
              <Dist>Von</Dist>
              { this.getModeForm(this.state.input) }
              <Dist>Zu</Dist>
              <div>
                <Label>Binär</Label>
                <Radio onChange={() => this.setTarget(2)}  type="radio" checked={this.state.to === 2}/>
              </div>
              <div>
                <Label>Dezimal</Label>
                <Radio onChange={() => this.setTarget(10)} type="radio" checked={this.state.to === 10}/>
              </div>
              <div>
                <Label>Hexadezimal</Label>
                <Radio onChange={() => this.setTarget(16)} type="radio" checked={this.state.to === 16}/>
              </div>
          </Form>
          <ResultsWrapper>
            <ResultsSpan>{this.state.result}</ResultsSpan>
          </ResultsWrapper>
        </Wrapper>
      </Body>
    )
  }

  getModeForm = input => {
    const isBin = this.numberCouldBeBin(input);
    const isDec = this.numberCouldBeDec(input);
    const isHex = this.numberCouldBeHex(input);
    
    if (isHex && isDec && isBin) {
      return (
      <div>
        <div><Label>Binär</Label><Radio onChange={() => this.setMode(2)} type="radio" checked={this.state.mode === 2}/></div>
        <div><Label>Dezimal</Label><Radio onChange={() => this.setMode(10)} type="radio" checked={this.state.mode === 10}/></div>
        <div><Label>Hexadezimal</Label><Radio onChange={() => this.setMode(16)} type="radio" name="to16" checked={this.state.mode === 16}/></div>
      </div>);
    }
    if (isHex && isDec && !isBin) {
      return (
      <div>
        <div><Label>Dezimal</Label><Radio onChange={() => this.setMode(10)} type="radio" checked={this.state.mode === 10}/></div>
        <div><Label>Hexadezimal</Label><Radio onChange={() => this.setMode(16)} type="radio" checked={this.state.mode === 16}/></div>
      </div>);
    }
    if (!isHex && isDec && isBin) {
      return (
      <div>
        <div><Label>Binär</Label><Radio onChange={() => this.setMode(2)}  type="radio" checked={this.state.mode === 2}/></div>
        <div><Label>Dezimal</Label><Radio onChange={() => this.setMode(10)} type="radio" checked={this.state.mode === 10}/></div>
      </div>);
    }
    if (!isHex && !isDec && isBin) {
      return <div><Label>Binär</Label><Radio onChange={() => this.setMode(2)}  type="radio" checked={this.state.mode === 2}/></div>;
    }
    if (isHex && !isDec && !isBin) {
      return <div><Label>Hexadezimal</Label><Radio onChange={() => this.setMode(16)} type="radio" checked={this.state.mode === 16}/></div>;
    }
    if (!isHex && isDec && !isBin) {
      return <div><Label>Dezimal</Label><Radio onChange={() => this.setMode(10)} type="radio" checked={this.state.mode === 10}/></div>;
    }
    // Invalid
    return <div>Ungültige Eingabe!</div>;
  }

  setMode = (mode, callback) => {
    callback = callback ? callback : () => {
      this.calc(this.state);
    };
    this.setState({
      mode: mode
    }, callback);
  }

  setTarget = target => {
    this.setState({
      to: target
    }, () => {
      this.calc(this.state);
    });
  }

  calc = state => {
    const {input, mode, to} = state;

    let setRes = res => {
      this.setState({
        result: res
      });
    };

    if (mode === to) {
      setRes(input);
      return;
    }
    if (mode === 2 && to === 10) {
      setRes(this.ConvertBase.bin2dec(input));
      return;
    }
    if (mode === 2 && to === 16) {
      setRes(this.ConvertBase.bin2hex(input));
      return;
    }
    if (mode === 10 && to === 2) {
      setRes(this.ConvertBase.dec2bin(input));
      return;
    }
    if (mode === 10 && to === 16) {
      setRes(this.ConvertBase.dec2hex(input));
      return;
    }
    if (mode === 16 && to === 2) {
      setRes(this.ConvertBase.hex2bin(input));
      return;
    }
    if (mode === 16 && to === 10) {
      setRes(this.ConvertBase.hex2dec(input));
      return;
    }
  }

  numberCouldBeBin = num => {
    num = num + "";
    num = num.split('');
    const numbers = [0, 1];

    for (const char of num) {
      if (numbers.indexOf(parseInt(char)) === -1) {
        return false;
      }
    }
    return true;
  }

  numberCouldBeDec = num => {
    num = num + "";
    num = num.split('');
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (const char of num) {
      if (numbers.indexOf(parseInt(char)) === -1) {
        return false;
      }
    }
    return true;
  }

  numberCouldBeHex = num => {
    num = num + "";
    num = num.split('');
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];

    for (const char of num) {
      if (numbers.indexOf(parseInt(char)) === -1 && numbers.indexOf(char) === -1) {
        return false;
      }
    }
    return true;
  }

}

const Body = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: darkslategray;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: inline-block;
  padding: 1rem;
  padding-bottom: 0rem;
  background: indianred;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  max-width: 250px;
`;

const Form = styled.form`
  padding: 1rem 1rem 0 1.5rem;
  display: flex;
  flex-direction: column;
`;

const TextInput = styled.input`
  font-size: 18px;
  padding: 0.25rem 0.5rem;
  border: none;
  outline: none;
  background: rgba(40, 40, 40, 0.25);
  color: #eee;
  width: 200px;
  margin-bottom: 0.5rem;
  margin-left: -0.5rem;
  box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.25);
`;

const Dist = styled.span`
  margin: .25rem 0 0.25rem -0.5rem;
  border-bottom: 1px solid #222;
  width: 11.5rem;
  font-weight: 700;

  :not(:first-of-type) {
    margin-top: 1rem;    
  }
`;

const Label = styled.span`
  width: 11rem;
  display: inline-block;
`;

const Radio = styled.input`
`;

const ResultsWrapper = styled.div`
  padding: 1rem;
`;

const ResultsSpan = styled.p`
  :before {
    content: '= ';
  font-weight: 100;
  }
  word-wrap: break-word;
  font-weight: 700;
`;

export default App;
