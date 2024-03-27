import "./CustomInput.css"

export const CustomInput = ({classname, placeholder, type, name, handler, value, required}) => {

    return (
        <input className={classname} placeholder={placeholder} type={type} name={name} value={value} required={required} onChange={(e) => handler(e)}></input>
    )
}