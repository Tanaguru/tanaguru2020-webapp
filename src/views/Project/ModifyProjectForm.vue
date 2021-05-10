<template>
	<form @submit.prevent="modifyProject">
		<div class="form-row">
			<div class="form-column">
				<div class="form-block">
					<label class="label" for="name1">{{ $t('entity.project.name') }} * :</label>
					<input
						class="input"
						type="text"
						name="name"
						id="name1"
						v-model="name"
						:aria-describedby="nameDescribedBy"
						required>
					<p class="info-text" id="name-constraint">{{ $t('form.indications.nameConstraint') }}</p>
					<p v-if="nameError" class="info-error" id="name-error">
						{{ nameError }}</p>
				</div>
			</div>

			<div class="form-column">
				<div class="form-block">
					<label class="label" for="domain">{{ $t('entity.project.domain') }} * :</label>
					<input
						class="input"
						type="text"
						name="domain"
						id="domain"
						v-model="domain"
						:aria-describedby="domainDescribedBy"
						required>
					<p class="info-text" id="domain-constraint">{{ $t('form.indications.urlConstraint') }}</p>
					<p v-if="domainError" class="info-error" id="domain-error">
						{{ domainError }}</p>
				</div>
			</div>
		</div>

		<button class="btn btn--default" type="submit">{{ $t('action.modify') }}</button>
		<p v-if="error" class="info-error">{{ error }}</p>
	</form>
</template>

<script>
export default {
	name: 'modify-project-form',
	props: ['project'],
	data() {
		return {
			name: project.name,
			domain: project.domain,
			nameError: "",
			domainError: "",
		}
	},
	methods: {
		modifyProject() {
			if (this.name.length === 0) {
				this.nameError = this.$i18n.t("form.errorMsg.emptyInput");
			} else if (this.name.length > 50) {
				this.nameError = this.$i18n.t("form.errorMsg.others.nameError")
			}

			if (this.contract.restrictDomain) {
				if (!this.checkValidDomain(this.domain)) {
					this.domainError = this.$i18n.t("form.errorMsg.others.urlError")
				} else {
					this.domainError = this.$i18n.t("form.errorMsg.others.urlError")
				}
			}

			this.projectService.modifyById(
				this.project.id,
				this.name,
				this.domain,
				(project) => {
					this.project = project;
					this.error = "";
					this.nameError = "";
					this.domainError = "";
					this.name = "";
					this.domain = "";


					setTimeout(() => (
						this.success = ""
					), 3000)
					this.$emit('update:project', project)
				},
				(error) => {
					console.error(error)
				}
			)
		},
	}
}
</script>
