import PropTypes from "prop-types"

const Button = ({text, color, onAdd}) => {
  
  return (
    <button 
      style={{backgroundColor: color}}
      className="btn"
      onClick={onAdd}
      >
      {text}
    </button>
  )
}

Button.defaultProps = {
  color: "steelblue"
}

Button.propTypes = {
  color: PropTypes.string,
  text: PropTypes.string,
}

export default Button