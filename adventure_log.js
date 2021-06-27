const api_url = ''
const adventure_log = {
	// retrieve the existing adventure log entries
	get() {
		return $.ajax({
			type: 'GET',
			url: `${api_url}/entries`,
			dataType: 'json'
		});
	},
	// add a single adventure log entry
	add(name, email, entry) {
		console.log('sending', name, email, entry)
		return $.ajax({
			type: 'PUT',
			url: `${api_url}/entries`,
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify({
				name,
				email,
				entry
			}),
			dataType: 'json'
		});
	}
};
(function() {

	let entriesTemplate;

	function prepareTemplates() {
		entriesTemplate = Handlebars.compile($('#entries-template').html());
	}
	 //retrieve entries and update the UI
	 function loadEntries() {
		 console.log('Loading entries...');
		 $('#entries').html('Loading entries...');
		 guestbook.get().done(function(result) {
			 if (!result.entries) {
				 return;
			 }

			 const context = {
				 entries: result.entries
			 }
			 $('entries').html(entriesTemplate(context));
		 }).error(function(error) {
			 $('entries').html('No entries');
			 console.log(error);
		 });
	 }

	 // intercept the click on the submit button, and the log entry and
	 // reload entries on success
	 $(document).on('submit', '#addEntry', function(e) {
		 e.preventDefault();

		 guestbook.add(
			 $('name').val().trim(),
			 $('email').val().trim(),
			 $('entry').val().trim()
		 ).done(function(result) {
			 // reload entries
			 loadEntries();
		 }).error(function(error) {
			 console.log(error);
		 });
	 });

	 $(document).ready(function() {
		 prepareTemplates();
		 loadEntries();
	 });
})();