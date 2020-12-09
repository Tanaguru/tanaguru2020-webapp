<template>
	<div class='filter' v-click-outside="closeList">
		<label class='filter__label' for='search-input'>
			{{ $t('resultAudit.displayOptions.search.filter') }}
			<span class='screen-reader-text'> ({{ $t('resultAudit.displayOptions.search.filterInfo') }} {{
					selection.length
				}})</span>
		</label>

		<p id='search-explanation' class='screen-reader-text'>({{ $t('resultAudit.displayOptions.search.help') }}</p>

		<div class='input-container' role='search'>
			<ul class='selected-words' tabIndex='-1'
				:aria-label="($t('resultAudit.displayOptions.search.selectedTags'))">
				<li class="selected-words__item selected-item" v-for='(tag, i) in selection' :key='i'>
					<span>{{ tag }}</span>
					<button class="btn btn--nude" :id='tag' @click='deleteKeyword(tag)'>
						<icon-base-decorative width="16" height="16" viewBox="0 0 24 24">
							<icon-close/>
						</icon-base-decorative>
						<span class="screen-reader-text">{{ $t('action.delete') }} {{ tag }}</span>
					</button>
				</li>
			</ul>

			<div class="select-tags">
				<input
					class="select-tags__input"
					role="combobox"
					type="search"
					id="search-input"
					ref="searchInput"
					:aria-expanded="listTagOpen === true ? 'true' : 'false'"
					aria-autocomplete="list"
					aria-controls="item-list"
					aria-describedby="search-explanation"
					multiple
					autocomplete="off"
					:placeholder="placeholder"
					v-model="input"
					@keydown.40.prevent="openOnDownPress"
					@keydown.13.prevent="confirmOnEnter"
					@keydown.tab="closeList"
					@keydown.esc="closeAndFocus"
				/>
				<div class="select-tags__arrow">
					<icon-base-decorative v-if='this.listTagOpen === false' class="angle-down"
										  @click.native='toggleOnClick'>
						<icon-arrow-blue/>
					</icon-base-decorative>
					<icon-base-decorative v-else class="angle-up" @click.native='toggleOnClick'>
						<icon-arrow-blue/>
					</icon-base-decorative>
				</div>
			</div>
		</div>

		<div class="select-list-wrapper">
			<ul
				id='item-list'
				class="select-list"
				ref="itemList"
				role='listbox'
				:hidden="!listTagOpen && !input"
				@blur="closeList"
			>
				<li
					class="select-list__item"
					role='option'
					tabIndex='-1'
					v-for='(tag, i) in shownTagList'
					:id='i'
					:key='tag'
					:ref="tag"
					:aria-selected='i === currentFocusedTagIndex'
					@keydown.40.prevent='arrowDownNavigation'
					@keydown.38.prevent='arrowUpNavigation'
					@keydown.13.prevent='selectTag(tag, i)'
					@keydown.esc="closeAndFocus"
					@keydown.tab="closeList"
					@mouseenter='focusOnHover(tag, i)'
					@click="selectTag(tag, i)"
				>
					{{ tag }}
				</li>
			</ul>

			<div aria-live='polite' class='screen-reader-text'>
				<p v-if='this.listTagOpen === true'>
					{{ $t('resultAudit.displayOptions.search.tagsList', {length: shownTagList.length}) }}</p>
			</div>

			<div aria-live='assertive' class='screen-reader-text' id='live-information'>
				<p v-if='this.liveContent !== ""'>{{ liveContent }}</p>
			</div>
		</div>
	</div>
</template>

<script>
import IconBaseDecorative from '@/components/icons/IconBaseDecorative'
import IconArrowBlue from '@/components/icons/IconArrowBlue'
import IconClose from '@/components/icons/IconClose'

import ClickOutside from 'vue-click-outside'

export default {
	name: 'SearchInput',
	components: {
		IconBaseDecorative,
		IconArrowBlue,
		IconClose,
	},
	props: ['propositions', 'selection'],
	data() {
		return {
			input: "",
			currentFocusedTagIndex: null,
			listTagOpen: false,
			liveContent: '',
		}
	},
	created() {
	},
	computed: {
		placeholder: function () {
			return this.selection.length === 0 ? 'Tags' : (null);
		},
		shownTagList: function () {
			return this.propositions.filter((tag) => {
				return this.selection.indexOf(tag) === -1 &&
					tag.toLowerCase().includes(this.input.toLowerCase()) &&
					!this.selection.includes(tag)
			})
		},
	},
	methods: {

		/** keyboard methods */
		closeList() {
			this.listTagOpen = false
			this.currentFocusedTagIndex = null
		},

		closeAndFocus() {
			this.listTagOpen = false
			this.$refs.searchInput.focus()
			this.currentFocusedTagIndex = null
		},

		// Opening the list when pressing down arrow
		openOnDownPress($event) {
			this.listTagOpen = true;
			this.currentFocusedTagIndex = 0;
			var currentFocusedTag = this.shownTagList[this.currentFocusedTagIndex];
			setTimeout(() => (
				this.$refs[currentFocusedTag.name][0].focus()
			), 50)
		},

		// Validating your input using enter
		confirmOnEnter() {
			this.tags.map(tag => {
					// checks if input doesn't match an already selected tag
					if (this.input.toLowerCase() == tag.id.toLowerCase() && this.selection.toString().toLowerCase().includes(this.input.toLowerCase()) === false) {
						// working through capitalization issues
						this.selection = [...this.selection, tag];
						// closes the list
						this.listTagOpen = false;
						// announces the new addition
						this.liveContent = 'You have added the following element to your selection : ' + this.input
						// resets input value
						this.input = '';

					}
				}
			)
		},

		arrowDownNavigation() {
			this.currentFocusedTagIndex = (this.currentFocusedTagIndex + 1) % this.shownTagList.length;
			var currentFocusedTag = this.shownTagList[this.currentFocusedTagIndex];
			this.$refs[currentFocusedTag.name][0].focus()
		},

		arrowUpNavigation() {
			if (this.currentFocusedTagIndex !== 0) {
				this.currentFocusedTagIndex = (this.currentFocusedTagIndex - 1) % this.shownTagList.length;
				var currentFocusedTag = this.shownTagList[this.currentFocusedTagIndex];
				this.$refs[currentFocusedTag.name][0].focus()
			} else {
				var currentFocusedTag = this.shownTagList[this.shownTagList.length - 1];
				this.currentFocusedTagIndex = this.shownTagList.length - 1;
				this.$refs[currentFocusedTag.name][0].focus()
			}
		},

		/** Mouse + Click events */

		// delete selected tag (KEYBOARD + MOUSE)
		deleteKeyword(tag) {
			this.$emit('removeKeyword', tag);
			setTimeout(() =>
					this.$refs.searchInput.focus(),
				this.liveContent = 'You have deleted the following element from your selection : ' + tag.id,
				50);
		},

		// Select option on click/enter
		selectTag(tag, index) {
			this.$emit('selectKeyword', tag);
			// announces the new addition
			this.liveContent = 'You have added the following element to your selection : ' + tag.id
			this.listTagOpen = false;
			this.input = '';
			this.$refs.searchInput.focus()
			setTimeout(() => {
				this.currentFocusedTagIndex = null
			}, 50)
		},

		/** Mouse events */

		// focus on list item on hover
		focusOnHover(tag, index) {
			this.currentFocusedTagIndex = index;
			var currentFocusedTag = this.shownTagList[this.currentFocusedTagIndex];
			this.$refs[currentFocusedTag][0].focus()
		},

		// Toggle list on click on caret
		toggleOnClick() {
			this.listTagOpen = !this.listTagOpen
			this.currentFocusedTagIndex = null
		},
	},
	mounted() {
		// prevent click outside event with popupItem.
		this.popupItem = this.$el
	},
	// close dropdown when clicking outside of it
	directives: {
		ClickOutside
	}
}
</script>

<style lang="scss" scoped>
.filter {
	.filter__label {
		display: block;
		margin-bottom: 1rem;
		padding-top: 1.6rem;
		color: $text-secondary;
		font-family: $font-stack-secondary;
		font-size: $small-font-size;
		font-weight: 600;

		@media #{$media-md-viewport} {
			padding-top: 3rem;
			font-size: 2rem;
		}
	}
}

.select-tags {
	position: relative;

	.select-tags__input {
		display: inline-block;
		width: 100%;
		padding: .8rem 1.5rem .8rem 2.4rem;
		border: 1px solid $border-primary;
		border-radius: .2rem;
		color: $text-secondary;
		cursor: pointer;

		&:focus,
		&:active,
		&[aria-expanded="true"] {
			border: 1px solid $text-secondary;
		}

		&[aria-expanded="true"] {
			& + .select-tags__arrow {
				background-color: $text-secondary;
			}
		}
	}

	.select-tags__arrow {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 4rem;
		background-color: transparent;

		svg {
			position: absolute;
			top: 50%;
			left: 50%;

			&.angle-down {
				transform: translate(-50%, -50%) rotate(90deg);
			}

			&.angle-up {
				transform: translate(-50%, -50%) rotate(-90deg);

				.stroke-color {
					stroke: $color-white;
				}
			}
		}
	}
}

.select-list-wrapper {
	position: relative;
}

.select-list {
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	margin: 0;
	padding: 0;
	background-color: $bg-primary;
	border: 1px solid $text-secondary;
	border-top: 0;
	color: $text-secondary;
	list-style-type: none;
	z-index: 101;

	.select-list__item {
		padding: 0 2.4rem;

		&[aria-selected="true"],
		&:hover {
			outline: none;
			background-color: $text-secondary;
			color: $color-white;
		}

		&:hover {
			cursor: pointer;
		}
	}
}

.selected-words {
	display: flex;
	margin: 0 0 .8rem;
	padding: 0;
	list-style-type: none;

	.selected-words__item {
		&:not(:last-child) {
			margin-right: .5rem;
		}
	}
}

.selected-item {
	margin-bottom: .8rem;
	padding: 0 1rem;
	border-radius: 1.6rem;
	background-color: $bg-secondary;
	color: $text-secondary;

	span,
	svg {
		vertical-align: middle;
	}

	button {
		padding: 0 .8rem;
	}
}
</style>
