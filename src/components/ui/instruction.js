import './instruction.scss';
import React, { Component } from 'react';
/*import ReactHtmlParser from 'react-html-parser';

const INSTRUCTION = (props) => {
  const accessed = props.instructionAccessed ? 'accessed' : 'not-accessed'
  return (
    <div className={`instruction ${props.className} ${accessed}`}>
      {props.text}
    </div>
  )
}

export default INSTRUCTION
*/
class Instruction extends Component {

  constructor(props) {
    super(props)
    this.state = {
      instructionAccessed:false
    }
  }

  componentWillReceiveProps(nextProps){
    const {instructionAccessed} = nextProps
    if(this.state.instructionAccessed){
      return
    }
    this.setState({
      instructionAccessed:instructionAccessed
    })
  }

  render() {
    const {
      className,
      text
    } = this.props
    const {instructionAccessed} = this.state
    const accessed = instructionAccessed ? 'accessed' : ''
    return (
      <div className={`instruction ${className} ${accessed}`}
      onClick={()=>{
        this.setState({'instructionAccessed':true})
      }}
      >
      {text}
      <div className="u-underline u-text-small"
      >close</div>
    </div>
    )
  }

}

export default Instruction
