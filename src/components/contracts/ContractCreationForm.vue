<template>
  <div>
    <p>{{ $t('form.indications.help') }}</p>
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
							<p class="info-text" id="contract-name-constraint">{{ $t('form.indications.nameConstraint') }}</p>
							<p v-show="contractCreateForm.nameError" id="name-error" class="info-error">{{contractCreateForm.nameError}}</p>
						</div>
					</div>

					<div class="form-column">
						<div class="form-block">
							<label class="label" for="dateEnd">{{$t('entity.contract.formDateEnd')}} *</label>
							<input
                v-if="$i18n.locale.toLowerCase() == 'en'"
                class="input"
                v-bind:class="{'has-error': contractCreateForm.dateError}"
                type="text"
                name="dateEnd"
                id="dateEnd"
                :aria-describedby="contractCreateForm.dateError ? 'date-error' : ''"
                v-model="contractCreateForm.dateEnd"
                required>

              <input
                v-else
                class="input"
                v-bind:class="{'has-error': contractCreateForm.dateError}"
                type="text"
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
  props: ['users', 'selected'],
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
  watch: {
    	selected: function(newVal, oldVal) {  
        if(newVal == 0) {
          this.contractCreateForm.name = ""
          this.contractCreateForm.ownerId = ""
          this.contractCreateForm.dateEnd = ""
          this.contractCreateForm.nameError = ""
          this.contractCreateForm.dateError = ""
          this.contractCreateForm.ownerError = ""
          this.contractCreateForm.error = ""
          this.successMsg = ""
        } 
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
        this.contractCreateForm.nameError = this.$i18n.t("form.errorMsg.emptyInput");
        return false;
      }

      if (this.contractCreateForm.name.length > 50) {
        this.contractCreateForm.nameError = this.$i18n.t("form.errorMsg.others.nameError");
        return false;
      }
      return true;
    },

    checkOwner() {
      this.contractCreateForm.ownerError = "";
      if (this.contractCreateForm.ownerId == null) {
        this.contractCreateForm.ownerError = this.$i18n.t("form.errorMsg.emptyInput");
        return false;
      }
      return true;
    },

    checkDateEnd() {
      let dateEndRegex = null;
      if(this.$i18n.locale.toLowerCase() == 'en'){
        dateEndRegex = /^(0[1-9]|1[012])[/](0[1-9]|[12][0-9]|3[01])[/](19|20)\d\d$/
      } else { dateEndRegex = /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d$/ }

      if(dateEndRegex.test(this.contractCreateForm.dateEnd)){
        return true;
      } else {
        this.contractCreateForm.dateError = this.$i18n.t('form.errorMsg.contract.invalidDateEnd')
        return false;
      }
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

        let dateEnd = this.contractCreateForm.dateEnd;
        if(this.$i18n.locale.toLowerCase() == 'en'){ 
          dateEnd = this.$moment(this.contractCreateForm.dateEnd, 'MM-DD-YYYY').format("YYYY-MM-DD")
        } else {
          dateEnd = this.$moment(this.contractCreateForm.dateEnd, 'DD-MM-YYYY').format("YYYY-MM-DD")
        }

        this.contractService.create(
          this.contractCreateForm.name,
          dateEnd,
          this.contractCreateForm.ownerId,
          this.contractCreateForm.restrictDomain,
          (contract) => {
            this.successMsg = this.$i18n.t("form.successMsg.contractCreation")
            this.$emit('createContract', contract)
          },
          (err) => {
            if(err.response.data.error == "CANNOT_CREATE_MULTIPLE_USER_CONTRACT"){
              this.contractCreateForm.error = this.$i18n.t("form.errorMsg.user.limitReached")
            } else if(err.response.data.error == "USER_NOT_FOUND"){
              this.contractCreateForm.error = this.$i18n.t("form.errorMsg.user.notFound")
            } else if(err.response.status == "403"){
              this.contractCreateForm.error = this.$i18n.t("form.errorMsg.user.permissionDenied")
            } else {  
              this.contractCreateForm.error = this.$i18n.t("form.errorMsg.genericError");
            }
          }
        )

        this.contractCreateForm.name = ""
        this.contractCreateForm.ownerId = ""
        this.contractCreateForm.dateEnd = ""
      }
    }
  }
}
</script>

