import arrow from "../../assets/icon/arrow.svg"

// `type` defaults to "button" so dropping one of these inside a form does not
// submit it by accident; the forms that do want a submit button pass type="submit".
const Button = ({ children, className = "", type = "button", ...rest }) => {
    return (
        <button
            type={type}
            className={`bg-primary flex justify-center items-center gap-1 text-white text-[16px] w-40 h-12 md:text-[24px] md:w-50.75 md:h-15.25 rounded-[72px] cursor-pointer  ${className}`}
            {...rest}
        >
            {children} <img src={arrow} alt="" className="" />
        </button>
    )
}

export default Button
