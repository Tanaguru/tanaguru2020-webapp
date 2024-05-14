<template>
  <main v-if="user" id="page" role="main" class="wrapper user">
    <Breadcrumbs :breadcrumbsItems="breadcrumbProps"></Breadcrumbs>

    <header class="headline">
      <h1>{{ user.username }}</h1>
    </header>

    <article>
      <h2 class="user__title-2">{{ $t("user.profile") }}</h2>

      <div v-if="modifyUserForm.active">
        <p>{{ $t("form.indications.help") }}</p>
        <form @submit.prevent="modifyUser" novalidate>
          <div class="form-row">
            <div class="form-column">
              <div class="form-block">
                <label class="label" for="username"
                  >{{ $t("entity.user.username") }} *</label
                >
                <p class="info-text">
                  {{ $t("form.errorMsg.username.invalidUsername") }}
                </p>
                <input
                  class="input"
                  v-bind:class="{
                    'has-error': modifyUserForm.usernameError,
                  }"
                  type="text"
                  name="username"
                  id="username"
                  :placeholder="$t('entity.user.username')"
                  v-model="modifyUserForm.username"
                />
                <p v-show="modifyUserForm.usernameError" class="info-error">
                  {{ modifyUserForm.usernameError }}
                </p>
              </div>
            </div>

            <div class="form-column">
              <div class="form-block">
                <label class="label" for="email">{{ $t("entity.user.email") }} *</label>
                <input
                  class="input"
                  v-bind:class="{
                    'has-error': modifyUserForm.emailError,
                  }"
                  type="email"
                  name="email"
                  id="email"
                  :placeholder="$t('entity.user.email')"
                  v-model="modifyUserForm.email"
                />
                <p v-show="modifyUserForm.emailError" class="info-error">
                  {{ modifyUserForm.emailError }}
                </p>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-column">
              <div
                class="form-block"
                id="select-approle"
                v-if="!isCurrentUser && $store.state.auth.authorities['PROMOTE_USER']"
              >
                <label class="label" for="status-select"
                  >{{ $t("entity.user.role.role") }} *</label
                >
                <div class="select">
                  <select
                    name="status-select"
                    id="status-select"
                    v-model="modifyUserForm.appRole"
                  >
                    <option value="SUPER_ADMIN">
                      {{ $t("entity.user.role.superAdmin") }}
                    </option>
                    <option value="ADMIN">{{ $t("entity.user.role.admin") }}</option>
                    <option value="USER">{{ $t("entity.user.role.user") }}</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-column">
              <fieldset
                class="checkbox-wrapper"
                v-show="
                  isCurrentUser == false && $store.state.auth.user.appRole.name != 'USER'
                "
              >
                <legend class="checkbox-wrapper__legend">
                  {{ $t("entity.user.status") }} *
                </legend>
                <div class="checkbox" v-if="$store.state.auth.authorities['MODIFY_USER']">
                  <input
                    class="checkbox__input"
                    type="checkbox"
                    name="enabled"
                    id="enabled"
                    v-model="modifyUserForm.enabled"
                  />
                  <label class="checkbox__label" for="enabled">{{
                    $t("entity.user.enabled")
                  }}</label>
                </div>

                <div class="checkbox" v-if="$store.state.auth.authorities['MODIFY_USER']">
                  <input
                    class="checkbox__input"
                    type="checkbox"
                    name="accountNonLocked"
                    id="accountNonLocked"
                    v-model="modifyUserForm.accountNonLocked"
                  />
                  <label class="checkbox__label" for="accountNonLocked">{{
                    $t("entity.user.blocked")
                  }}</label>
                </div>
              </fieldset>
            </div>
          </div>

          <button class="btn btn--default btn-modify" type="submit">
            {{ $t("action.modify") }}
          </button>
          <p v-if="modifyUserForm.error" class="info-error">
            {{ modifyUserForm.error }}
          </p>
        </form>
      </div>

      <div v-else>
        <ul class="infos-list">
          <li id="username">
            <span class="infos-list__exergue">{{ $t("entity.user.username") }}</span>
            :
            {{ user.username }}
          </li>
          <li id="email" v-if="$store.state.auth.user.appRole.name != 'USER'">
            <span class="infos-list__exergue">{{ $t("entity.user.email") }}</span>
            :
            {{ user.email }}
          </li>
          <li>
            <span class="infos-list__exergue">{{ $t("entity.user.role.role") }}</span>
            :
            {{
              user.appRole.name.charAt(0) +
              user.appRole.name.slice(1).toLowerCase().replace(/_/g, " ")
            }}
          </li>
          <li
            id="enabled"
            v-if="!isCurrentUser && $store.state.auth.authorities['MODIFY_USER']"
          >
            <span class="infos-list__exergue">{{ $t("entity.user.enabled") }}</span>
            :
            {{ user.enabled }}
          </li>
          <li
            id="blocked"
            v-if="!isCurrentUser && $store.state.auth.authorities['MODIFY_USER']"
          >
            <span class="infos-list__exergue">{{ $t("entity.user.blocked") }}</span>
            :
            {{ !user.accountNonLocked }}
          </li>
        </ul>

        <button
          class="btn btn--default btn-modify"
          v-if="$store.state.auth.authorities['MODIFY_USER'] || isCurrentUser"
          @click="showModifyUserForm()"
        >
          {{ $t("action.modify") }}
        </button>
        <p v-if="modifyUserForm.error" class="info-error">
          {{ modifyUserForm.error }}
        </p>
        <p class="info-success" v-if="modifyUserForm.successMsg">
          {{ modifyUserForm.successMsg }}
        </p>
      </div>
    </article>

    <!-- password -->

    <article v-show="isCurrentUser">
      <h2 class="user__title-2">{{ $t("action.changePassword") }}</h2>

      <div v-if="modifyPasswordForm.active">
        <p>{{ $t("form.indications.help") }}</p>
        <form @submit.prevent="modifyPassword" novalidate>
          <div class="form-block">
            <label class="label" for="password2"
              >{{ $t("entity.user.newPassword") }} *</label
            >
            <input
              class="input"
              type="password"
              name="password"
              id="password2"
              :placeholder="$t('entity.user.password')"
              v-model="modifyPasswordForm.password"
              autocomplete="new-password"
              required
            />
            <p v-if="modifyPasswordForm.passwordError" class="info-error">
              {{ modifyPasswordForm.passwordError }}
            </p>
          </div>

          <div class="form-block">
            <label class="label" for="passwordConfirm"
              >{{ $t("entity.user.passwordConfirm") }} *</label
            >
            <input
              class="input"
              type="password"
              name="passwordConfirm"
              id="passwordConfirm"
              :placeholder="$t('entity.user.passwordConfirm')"
              v-model="modifyPasswordForm.passwordConfirm"
              autocomplete="new-password"
              required
            />
            <p v-if="modifyPasswordForm.confirmationError" class="info-error">
              {{ modifyPasswordForm.confirmationError }}
            </p>
          </div>

          <button class="btn btn--default btn-modify" type="submit">
            {{ $t("action.changePassword") }}
          </button>
          <p v-if="modifyPasswordForm.error" class="info-error">
            {{ modifyPasswordForm.error }}
          </p>
        </form>
      </div>

      <div v-else>
        <button class="btn btn--default btn-modify" @click="showModifyPasswordForm()">
          {{ $t("action.modify") }}
        </button>
      </div>
    </article>

    <!-- generate token -->
    <article v-show="isCurrentUser">
      <h2 class="user__title-2">{{ $t("user.myToken") }}</h2>

      <p>{{ $t("user.tokenDesc") }}</p>

      <div class="form-row">
        <div class="form-column">
          <div id="user-token-container" class="form-block" tabindex="-1">
            <p aria-live="polite">
              <span v-if="tokenExpiration" class="user-token-expiration">
                <span>token: ******</span>
                <span>{{ $t("user.tokenExpiration") + " " + tokenExpiration }}</span>
              </span>
            </p>

            <div class="form-block">
              <label class="label" for="token-validity">{{
                $t("user.tokenExpirationLabel")
              }}</label>

              <div class="select">
                <select
                  id="token-validity"
                  v-model="tokenValidity"
                  name="token-validity"
                  required
                >
                  <option value="day" selected>{{ $t("global.today") }}</option>
                  <option value="month">{{ "30 " + $t("global.days") }}</option>
                </select>
              </div>
            </div>

            <button
              class="btn btn--icon btn--default"
              aria-controls="tooltip__token"
              :aria-expanded="showTokenTooltip"
              @click="openTokenTooltip()"
            >
              <icon-base-decorative>
                <icon-arrow-blue v-if="tokenExpiration" />
                <icon-plus v-else />
              </icon-base-decorative>

              <span v-if="tokenExpiration">{{ $t("user.tokenRenew") }}</span>
              <span v-else>{{ $t("user.tokenGenerate") }}</span>
            </button>

            <div id="tooltip__token" role="tooltip" v-show="showTokenTooltip">
              <div class="tooltip-clipboard">
                <input readonly class="input" id="user_token" :value="userToken" />
                <button @click.stop.prevent="copyToken()" class="btn btn--clipboard">
                  {{ copyButtonText }}
                </button>
              </div>
              <div aria-live="polite" class="screen-reader-text">
                {{ screenReaderInfo }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>

    <!-- list contracts -->

    <article
      id="user-contracts"
      v-if="$store.state.auth.user.appRole.name != 'USER' || isCurrentUser"
    >
      <h2 class="user__title-2">{{ $t("user.contracts") }}</h2>

      <div v-if="contracts.length > 0">
        <profile-contract-table
          :contracts="contracts"
          :current-page="contractCurrentPage"
          :total-pages="contractTotalPage"
          :element-by-page="contractPageSize"
          :total-elements="contractTotal"
        >
        </profile-contract-table>

        <pagination
          :current-page="contractCurrentPage"
          :total-pages="contractTotalPage"
          @changePage="
            (page) => {
              loadContracts(page, contractPageSize);
            }
          "
        />
      </div>
      <p v-else-if="$route.params.id == $store.state.auth.user.id">
        {{ $t("user.noContract") }}
      </p>
      <p v-else>{{ $t("user.adminNoContract") }}</p>
    </article>

    <BackToTop />
  </main>
</template>

<script>
import IconBaseDecorative from "../../components//icons/IconBaseDecorative";
import IconArrowBlue from "../../components//icons/IconArrowBlue";
import IconPlus from "../../components/icons/IconPlus";
import Breadcrumbs from "../../components/Breadcrumbs";
import ProfileContractTable from "./ProfileContractTable";
import BackToTop from "../../components/BackToTop";
import EmailHelper from "../../helper/emailHelper";
import PasswordHelper from "../../helper/PasswordHelper";
import Pagination from "../../components/Pagination";

export default {
  name: "userDetail",
  components: {
    IconBaseDecorative,
    IconArrowBlue,
    IconPlus,
    ProfileContractTable,
    Breadcrumbs,
    BackToTop,
    EmailHelper,
    PasswordHelper,
    Pagination,
  },
  data() {
    return {
      breadcrumbProps: [
        {
          name: this.$i18n.t("page.dashboard"),
          path: "/",
        },
      ],
      user: null,
      isCurrentUser: false,
      tokenTooltipDisplayed: false,
      screenReaderInfo: "",
      contracts: [],
      modifyUserForm: {
        active: false,
        username: "",
        email: "",
        appRole: "",
        enabled: false,
        accountNonLocked: true,
        emailError: "",
        usernameError: "",
        successMsg: "",
      },
      modifyPasswordForm: {
        active: false,
        password: "",
        passwordConfirm: "",
        error: "",
        passwordError: "",
        confirmationError: "",
        successMsg: "",
      },
      contractPageSize: 5,
      contractTotalPage: 0,
      contractCurrentPage: 0,
      contractTotal: 0,
      userToken: null,
      tokenExpiration: null,
      tokenValidity: "day",
      copyButtonText: this.$i18n.t("action.copy"),
    };
  },
  metaInfo() {
    return {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: this.$i18n.t("global.siteName") + " - " + this.$i18n.t("title.profile"),
      meta: [
        {
          name: "robots",
          content: "noindex",
        },
      ],
    };
  },
  computed: {
    showTokenTooltip() {
      return this.tokenTooltipDisplayed;
    },
  },
  methods: {
    showModifyUserForm() {
      this.modifyUserForm.username = this.user.username;
      this.modifyUserForm.email = this.user.email;
      this.modifyUserForm.appRole = this.user.appRole.name;
      this.modifyUserForm.enabled = this.user.enabled;
      this.modifyUserForm.accountNonLocked = !this.user.accountNonLocked;
      this.modifyUserForm.active = true;
    },
    checkValidEmail: EmailHelper.checkValidEmail,
    modifyUser() {
      this.modifyUserForm.error = "";

      if (
        this.modifyUserForm.username === "" ||
        this.modifyUserForm.username.length < 4
      ) {
        this.modifyUserForm.usernameError = this.$i18n.t(
          "form.errorMsg.username.invalidUsername"
        );
      }

      if (!this.modifyUserForm.email) {
        this.modifyUserForm.emailError = this.$i18n.t("entity.user.emailError");
      } else if (!this.checkValidEmail(this.modifyUserForm.email)) {
        this.modifyUserForm.emailError = this.$i18n.t("form.errorMsg.email.notEmail");
      }

      if (
        this.modifyUserForm.email &&
        this.modifyUserForm.username &&
        this.checkValidEmail(this.modifyUserForm.email)
      ) {
        if (this.isCurrentUser) {
          this.userService.modifyMe(
            this.modifyUserForm.username,
            this.modifyUserForm.email.toLowerCase(),
            this.user.appRole.name,
            this.user.enabled,
            (user, token) => {
              this.$store.state.auth.user = user;
              this.user = user;
              this.modifyUserForm.active = false;
              this.modifyUserForm.successMsg = this.$i18n.t(
                "form.successMsg.savedChanges"
              );
              this.$store.commit("auth_success", { token: token, user: this.user });
            },
            (error) =>
              (this.modifyUserForm.error = this.$i18n.t("form.errorMsg.genericError"))
          );
        } else {
          this.userService.modifyUser(
            this.user.id,
            this.modifyUserForm.username,
            this.modifyUserForm.email.toLowerCase(),
            this.modifyUserForm.appRole,
            this.modifyUserForm.enabled,
            !this.modifyUserForm.accountNonLocked,
            (user) => {
              this.user = user;
              this.modifyUserForm.active = false;
              this.modifyUserForm.successMsg = this.$i18n.t(
                "form.successMsg.savedChanges"
              );
            },
            (error) =>
              (this.modifyUserForm.error = this.$i18n.t("form.errorMsg.genericError"))
          );
        }
      }
    },
    showModifyPasswordForm() {
      this.modifyPasswordForm.password = "";
      this.modifyPasswordForm.passwordConfirm = "";
      this.modifyPasswordForm.active = true;
    },
    checkValidPassword: PasswordHelper.checkValidPassword,
    modifyPassword() {
      if (
        this.modifyPasswordForm.password.length == 0 ||
        this.modifyPasswordForm.passwordConfirm.length == 0
      ) {
        if (this.modifyPasswordForm.password.length == 0) {
          this.modifyPasswordForm.passwordError = this.$i18n.t(
            "form.errorMsg.emptyInput"
          );
        }
        if (this.modifyPasswordForm.passwordConfirm.length == 0) {
          this.modifyPasswordForm.confirmationError = this.$i18n.t(
            "form.errorMsg.emptyInput"
          );
        }
      } else if (!this.checkValidPassword(this.modifyPasswordForm.password)) {
        this.modifyPasswordForm.confirmationError = this.$i18n.t(
          "form.errorMsg.password.passwordError"
        );
      } else if (
        this.modifyPasswordForm.password != this.modifyPasswordForm.passwordConfirm
      ) {
        this.modifyPasswordForm.error = this.$i18n.t(
          "form.errorMsg.password.incorrectConfirmation"
        );
      } else {
        this.modifyPasswordForm.error = "";
        this.userService.changePassword(
          this.modifyPasswordForm.password,
          this.user.id,
          null,
          (user) => {
            this.modifyPasswordForm.active = false;
            this.modifyPasswordForm.successMsg = this.$i18n.t(
              "form.successMsg.savedChangesChange"
            );
          },
          (error) =>
            (this.modifyPasswordForm.error = this.$i18n.t("form.errorMsg.genericError"))
        );
      }
    },
    generateToken() {
	  const now = Date.now();
	  let date = "month" === this.tokenValidity ? new Date(now + 2592000000) : new Date(now + 86400000);

	  this.tokenExpiration = null;
	  this.userToken = null;

      this.userService.generateToken(
        this.user.id,
        [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-"),
        (data) => {
          this.userToken = data;
          this.getTokenExpiration();
        },
        (error) => console.error(error)
      );
    },
    getTokenExpiration() {
      this.userService.getTokenExpiration(
        this.user.id,
        (data) => {
          let date = new Date(data);
          this.tokenExpiration = date.toLocaleDateString(this.$i18n.locale);
        },
        (error) => console.error(error)
      );
    },
    openTokenTooltip() {
      this.tokenTooltipDisplayed = !this.tokenTooltipDisplayed;
      this.screenReaderInfo = "";
      this.copyButtonText = this.$i18n.t("action.copy");
      let elementToken = document.getElementById("tooltip__token");
      elementToken.hidden = false;
      this.generateToken();
    },
    copyToken() {
      let elementToken = document.getElementById("user_token");
      elementToken.select();

      try {
        navigator.clipboard.writeText(elementToken.value);
        this.copyButtonText = this.$i18n.t("resultAudit.copyLink.success");
        this.screenReaderInfo = this.$i18n.t("resultAudit.copyLink.sucessHelp");

        setTimeout(() => {
          this.tokenTooltipDisplayed = !this.tokenTooltipDisplayed;
          this.userToken = "";
        }, 400);
      } catch (err) {
        this.copyButtonText = this.$i18n.t("resultAudit.copyLink.fail");
        this.screenReaderInfo = this.$i18n.t("resultAudit.copyLink.failHelp");
      }

      elementToken.closest("#user-token-container").focus();
    },
    loadContracts(page, size) {
      this.contractService.findByUserId(
        this.$route.params.id,
        page,
        size,
        (contracts) => {
          this.contractCurrentPage = page;
          this.contracts = contracts.content;
          this.contractTotalPage = contracts.totalPages;
          this.contractTotal = contracts.totalElements;
        },
        (error) => console.error(error)
      );
    },
  },
  created() {
    this.isCurrentUser = this.$store.state.auth.user.id == this.$route.params.id;
    if (this.$route.params.id) {
      if (!this.isCurrentUser && !this.$store.state.auth.authorities["SHOW_USER"]) {
        this.$router.replace("/");
      } else {
        this.userService.findById(
          this.$route.params.id,
          (user) => {
            this.user = user;

            if (this.$store.state.auth.user.appAccountType.name != "FREE") {
              this.breadcrumbProps.push({
                name: "Administration",
                path: "/administration",
              });
            }

            this.breadcrumbProps.push({
              name: this.isCurrentUser
                ? this.$i18n.t("user.myProfile")
                : this.user.username,
            });

            this.getTokenExpiration();
          },
          (err) => {
            this.$router.replace("/404");
          }
        );

        this.loadContracts(this.contractCurrentPage, this.contractPageSize);
      }
    } else {
      this.$router.replace("/");
    }
  },
};
</script>

<style lang="scss" scoped>
.user {
  .user__title-2 {
    margin-top: 6.2rem;
    margin-bottom: 3.1rem;
  }

  .infos-list {
    margin-bottom: 2.4rem;
  }

  .select {
    max-width: 35rem;
  }

  .btn-modify {
    margin-top: 1.6rem;
  }
}

#user-token {
  resize: none;
  overflow: hidden;
  min-height: 50px;
}

.user-token-expiration span:first-child() {
	margin-right: 1rem;
}
</style>
