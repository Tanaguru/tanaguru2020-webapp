<template>
  <div>
    <p>{{ $t('form.help') }}</p>
    <form @submit.prevent="createContract" novalidate >
				<div class="form-row">
					<div class="form-column">
						<div class="form-block">
							<label class="label" for="name">{{$t('entity.contract.name')}} *</label>
							<input
                class="input"
                v-bind:class="{'has-error': contractCreateForm.nameError}"
                :aria-describedby="nameDescribedBy"
                type="text"
                name="name"
                id="name"
                :placeholder="$t('entity.contract.name')"
                v-model="contractCreateForm.name"
                required>
							<p class="info-text" id="contract-name-constraint">{{ $t('form.nameConstraint') }}</p>
							<p v-show="contractCreateForm.nameError" id="name-error" class="info-error">{{contractCreateForm.nameError}}</p>
						</div>
					</div>

					<div class="form-column">
						<div class="form-block">
							<label class="label" for="dateEnd">{{$t('entity.contract.dateEnd')}} *</label>
							<input
                class="input"
                v-bind:class="{'has-error': contractCreateForm.dateError}"
                type="date"
                name="dateEnd"
                id="dateEnd"
                :aria-describedby="contractCreateForm.dateError ? 'date-error' : ''"
                v-model="contractCreateForm.dateEnd"
                required>
							<p v-show="contractCreateForm.dateError" id="date-error" class="info-error">{{contractCreateForm.dateError}}</p>
						</div>
					</div>
				</div>

        <div class="form-row">
					<div class="form-column">
              <div class="form-block">
                  <label class="label" for="owner-select">{{$t('entity.contract.owner')}} *</label>
                  <div class="select">
                      <select id="owner-select" v-bind:class="{'has-error': contractCreateForm.ownerError}" name="owner-select" v-model="contractCreateForm.ownerId" aria-describedby="owner-error" required>
                          <option value="" disabled>{{$t('entity.contract.selectOwner')}}</option>
                          <option v-for="user of users" :key="user.id" :value="user.id">{{user.username}}</option>
                      </select>
                  </div>
                  <p v-show="contractCreateForm.ownerError" id="owner-error" class="info-error">{{contractCreateForm.ownerError}}</p>
              </div>
          </div>
          <div class="form-column">
              <div class="form-block">
                  <div class="checkbox-wrapper">
                      <input type="checkbox" id="restrict-domain" v-bind:class="{'has-error': contractCreateForm.ownerError}" name="restrict-domain" v-model="contractCreateForm.restrictDomain" aria-describedby="restrict-error">
                  </div>
                  <label class="label" for="restric-domain">{{ $t('entity.contract.restrictDomain') }}</label>
              </div>
          </div>
      </div>

      <button class="btn btn--default" type="submit">{{ $t('action.create') }}</button>
      <p v-if="contractCreateForm.error" id="form-error" class="info-error">{{ contractCreateForm.error }}</p>
      <p v-if="successMsg" id="form-success" class="info-success">{{ successMsg }}</p>
    </form>
  </div>
</template>

<script>
export default {
  name: 'contractCreationForm',
  props: ['users'],
  data() {
    return {
      contractCreateForm: {
        name: null,
        ownerId: null,
        dateEnd: null,
        error: "",
        nameError: "",
        dateError: "",
        ownerError: "",
        restrictDomain: false
      },
      successMsg: "",
    }
  },
  computed: {
    nameDescribedBy() {
      let description = 'contract-name-constraint';
      if (this.contractCreateForm.nameError) {
        description = 'name-error contract-name-constraint'
      }
      return description;
    }
  },
  methods: {
    checkName() {
      this.contractCreateForm.nameError = "";
      if (!this.contractCreateForm.name) {
        this.contractCreateForm.nameError = this.$i18n.t("form.emptyInput");
        return false;
      }

      if (this.contractCreateForm.name.length > 50) {
        this.contractCreateForm.nameError = this.$i18n.t("form.nameError");
        return false;
      }
      return true;
    },

    checkOwner() {
      this.contractCreateForm.ownerError = "";
      if (this.contractCreateForm.ownerId == null) {
        this.contractCreateForm.ownerError = this.$i18n.t("form.emptyInput");
        return false;
      }
      return true;
    },

    checkDateEnd() {
      this.contractCreateForm.dateEndError = "";
      if (!this.contractCreateForm.dateEnd) {
        this.contractCreateForm.dateError = this.$i18n.t("form.emptyInput");
        return false;
      }
      return true;
    },

    createContract() {
      this.contractCreateForm.error = "";
      this.contractCreateForm.nameError = "";
      this.contractCreateForm.dateError = "";
      this.contractCreateForm.ownerError = "";
      this.successMsg = "";

      let isFormValid = this.checkName()
      isFormValid &= this.checkDateEnd();
      isFormValid &= this.checkOwner();

      if (isFormValid) {
        this.contractService.create(
            this.contractCreateForm.name,
            this.contractCreateForm.dateEnd,
            this.contractCreateForm.ownerId,
            this.contractCreateForm.restrictDomain,
            (contract) => {
              this.successMsg = this.$i18n.t("form.contractCreation")
              this.$emit('createContract', contract)
            },
            (err) => {
              if(err.response.data.error == "CANNOT_CREATE_MULTIPLE_USER_CONTRACT"){
                this.contractCreateForm.error = "This user has reached their contract limit"
              } else {  
                this.contractCreateForm.error = this.$i18n.t("form.genericError");
              }
            }
        )
      }
    }
  }
}
</script>

