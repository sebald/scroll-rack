module.exports = function ( value ) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);

    if (value) {
        console.log("Value");
        console.log("====================");
        console.log(value);
    }
}