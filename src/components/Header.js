import Button from "./Button";

const Header = ({title, onAdd, showAdd}) => {
  

  return (
    <header className="header">
      <h1>{title} </h1>
      < Button 
        text={showAdd ? "Close" : "Add"} 
        color={showAdd ? "red" : "green"} 
        onAdd={onAdd}
        />
    </header>
  )
}

Header.defaultProps = {
  title: "Task Tracker"
}

export default Header