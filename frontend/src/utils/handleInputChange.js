export default function handleInputChange(e, setInputs) {
    const { name, value } = e.target;
    
    setInputs((prevInput) => ({
        ...prevInput,
        [name]: value,
    }));
}