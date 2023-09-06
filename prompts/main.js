import PromptDB from "./storage.js";

let tagNames = [];
let currentPromptID = null;

async function loadAllPrompts(searchTerm = "") {
    try {
        const prompts = await PromptDB.getAllPrompts();
        const filteredPrompts = prompts.filter(prompt =>
            prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prompt.promptText.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        $("#promptList").empty();

        filteredPrompts.forEach(prompt => {
            const card = $('<div class="card border rounded p-4 mb-4">')
                .append($('<h2 class="text-xl font-semibold mb-2">').text(prompt.title))
                .append($('<hr class="mb-2">'))
                .append($('<p class="text-base mb-2">').text(prompt.promptText))
                .append($('<hr class="mb-2">'))
                .append(
                    $('<div class="flex flex-wrap">').append(
                        prompt.tags.map(tag =>
                            $('<span class="bg-gray-200 rounded-full px-2 py-1 text-sm mr-1 mb-1">').text(tag)
                        )
                    )
                );

            card.data('id', prompt.id);
            $("#promptList").append(card);
        });

    } catch (err) {
        alert("Error loading prompts: " + err.message);
    }
}

async function loadAllTags() {
    try {
        const tags = await PromptDB.getAllTags();
        tagNames = tags.map(tag => tag.name);

        $("#tags").empty();
        tagNames.forEach(tag => {
            var newOption = new Option(tag, tag, false, false);
            $('#tags').append(newOption).trigger('change');
        });

    } catch (err) {
        alert("Error loading tags: " + err.message);
    }
}

$(document).ready(async function () {
    try {
        await PromptDB.initDB();
        await loadAllPrompts();
        await loadAllTags();

        const selectedTags = $("#tags").val();

        $("#searchInput").on("input", async function () {
            const searchTerm = $(this).val();
            await loadAllPrompts(searchTerm);
        });

        $("#addBtn").click(openModal);

        $("#promptList").on("click", ".card", async function () {
            const promptID = $(this).data('id');
            try {
                const promptData = await PromptDB.getPrompt(promptID);
                populateForm(promptData);
                currentPromptID = promptID;
                openModal();
            } catch (err) {
                alert("Error loading prompt: " + err.message);
            }
        });

        $("#crudForm").submit(async function (event) {
            event.preventDefault();
            const promptData = {
                title: $("#title").val(),
                promptText: $("#promptText").val(),
                tags: $("#tags").val()
            };

            try {
                if (currentPromptID) {
                    await PromptDB.updatePrompt(currentPromptID, promptData);
                } else {
                    await PromptDB.addPrompt(promptData);
                }

                for (const tag of promptData.tags) {
                    if (!tagNames.includes(tag)) {
                        await PromptDB.addTag(tag);
                        tagNames.push(tag);

                        // Also add the new tag to Select2 dropdown
                        const newOption = new Option(tag, tag, false, false);
                        $('#tags').append(newOption).trigger('change');
                    }
                }

                await loadAllPrompts();
                closeModal();
            } catch (err) {
                alert(err.message);
            }
        });

        $("#deleteBtn").click(async function () {
            if (currentPromptID) {
                const isConfirmed = window.confirm("Are you sure you want to delete this prompt?");
                if (isConfirmed) {
                    try {
                        await PromptDB.deletePrompt(currentPromptID);
                        await loadAllPrompts();
                        closeModal();
                    } catch (err) {
                        alert("Error deleting prompt: " + err.message);
                    }
                }
            }
        });

        $("#tags").select2({
            tags: true,
            tokenSeparators: [',', ' ']
        });

        $("#tags").on('select2:open', function (e) {
            // Listen for keydown events on the search field
            $('.select2-search__field').on('keydown', function (event) {
                if (event.keyCode === 9) {  // Tab key
                    event.preventDefault();
                    const highlightedItem = $('.select2-results__option--highlighted').text();
                    if (highlightedItem) {
                        // Create a new tag and add it to the selected tags
                        const selectedTags = $('#tags').val() || [];
                        selectedTags.push(highlightedItem);
                        $('#tags').val(selectedTags).trigger('change');

                        // Close the dropdown
                        $('#tags').select2('close');
                    }
                }
            });
        });

        $("#closeModalBtn").click(closeModal);

        $(document).keydown(function (event) {
            if (event.keyCode === 27) {  // Escape key
                closeModal();
            }
        });

    } catch (err) {
        alert("Failed to initialize database: " + err.message);
    }
});

function populateForm(promptData) {
    $("#title").val(promptData.title);
    $("#promptText").val(promptData.promptText);
    $("#tags").val(promptData.tags).trigger("change");
}

function openModal() {
    currentPromptID ? $("#deleteBtn").removeClass("hidden") : $("#deleteBtn").addClass("hidden");
    $("#crudModal").removeClass("hidden");
    $("#title").focus();
}

function closeModal() {
    $("#crudModal").addClass("hidden");
    currentPromptID = null;  // Reset the currently selected prompt ID
    $("#title").val("");
    $("#promptText").val("");
    $("#tags").val([]).trigger("change");  // Reset tags
}
