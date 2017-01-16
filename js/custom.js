/* Vanilla JS is being used instead of the popular alternatives, jQuery and
 * Bootstrap, to avoid loading the complete jQuery and Bootstrap libraries and
 * adding overheads.
 */
var changeCharBtn = document.getElementById("changeCharacter");

// Show the custom modal
changeCharBtn.addEventListener("click", function() {
	var character = showModal();
})

/* This function displays the modal and registers the event listeners for
 * the images. Once the user clicks on a different image the player sprite
 * is updated.
 */
function showModal() {
    // Custom modal section
	var modal = document.getElementById("charSelection");

    // Button to close the modal
	var closeButton = document.getElementById("closeModal");

    // Display the modal
	modal.style.display = "block";

    // Close the modal
	closeModal.addEventListener("click", function(e) {
		modal.style.display = "none";
	});

    // Putting the list of character images into an array
	var chars = document.getElementsByClassName("char");

    // Traversing the array and adding event listeners for each image element
	for(var i = 0; i < chars.length; i++) {
        // Event listeners for the character images
		chars[i].addEventListener("click",
		function(e) {
			console.log(this.getAttribute("src"));
			player.sprite = this.getAttribute("src");
			modal.style.display = "none";
		});
	}
}