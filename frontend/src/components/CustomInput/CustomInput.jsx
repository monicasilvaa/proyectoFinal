import "./CustomInput.css"

export const CustomInput = ({placeholder, type, name, handler, value, required}) => {

    return (
        <input placeholder={placeholder} type={type} name={name} value={value} required={required} onChange={(e) => handler(e)}></input>
    )
}