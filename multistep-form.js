/**
 * ============================================================
 *  Multistep Form Script — Full-Featured Edition
 *  Drop-in replacement using the same data-attribute API
 * ============================================================
 *
 *  CORE ATTRIBUTES
 *  ───────────────
 *  data-form="multistep"               Form element (must be on <form>)
 *  data-form="step"                    Each step wrapper
 *  data-form="next-btn"                Next button (NOT on <input type="submit">)
 *  data-form="back-btn"                Back button (NOT on <input type="submit">)
 *  data-form="submit-btn"              Submit button (<input type="submit">)
 *  data-form-ms="submit-btn"           Alternate submit button selector
 *
 *  PROGRESS
 *  ────────
 *  data-form="progress"                Progress bar fill element
 *  data-form="progress-indicator"      Indicator items (auto-cloned per step)
 *  data-form="custom-progress-indicator" Custom progress items
 *  data-text="current-step"            Displays current step number
 *  data-text="total-steps"             Displays total step count
 *  data-clickable                      Clickable progress indicator ("true" = any, else only visited)
 *
 *  ANSWER CARDS / BRANCHING
 *  ────────────────────────
 *  data-card="true"                    Mark step as a card (excluded from numbered steps)
 *  data-answer="<value>"               Clickable answer card; value matches data-go-to targets
 *  data-go-to="<answer>"               On parent of answer to specify which answer-step to show
 *  data-skip-to="<stepNumber>"         Skip to a specific step number (1-indexed in markup)
 *
 *  VALIDATION & ERRORS  ★ FULL SUPPORT ★
 *  ──────────────────────────────────────
 *  data-custom-error-message           Enable per-field error messages (on form)
 *  data-text="error-message"           Error message element (sibling/child of input wrapper)
 *  data-min-character="<n>"            Min character length on text/textarea/password/number/tel
 *  data-checkbox="<n|*>"               Required checkbox count (* = all, n = minimum)
 *  data-domain-not-allowed="x,y"       Block email domains (comma-separated)
 *
 *  PHONE
 *  ─────
 *  data-phone-autoformat="(xxx) xxx-xxxx"  Auto-format phone input
 *  data-phone-format                       Enable phone format mode (on form)
 *
 *  RADIO AUTO-SKIP
 *  ───────────────
 *  data-radio-skip                     Auto-advance when a radio is selected
 *  data-radio-delay="<ms>"             Delay before auto-advance (default 250)
 *
 *  CONDITIONAL / PROGRESSIVE LOGIC
 *  ───────────────────────────────
 *  data-logic-extra                    Enable extended logic mode (on form wrapper)
 *  data-conditional-result="AND"       AND-mode conditional results (on [data-conditional-result])
 *  data-show-if="field=value&..."      Show element only when all conditions met
 *  data-progressive-input="<name>"     Progressive disclosure input
 *  data-progressive-target="<name>"    Target shown when progressive input has value
 *  data-progressive-input-value="<v>"  Specific value to match (* = any)
 *
 *  DISPLAY / MIRROR VALUES
 *  ───────────────────────
 *  data-display-input                  Mirror input values to display elements
 *  data-display-wrapper="<name>"       Wrapper for display (shows when input has value)
 *  data-display-input-wrapper="<name>" Input-sourced display wrapper
 *  data-input-field="<name>"           Rendered display field
 *  data-click-addclass="<class>"       Add class on click (checkbox/radio styling)
 *
 *  MEMORY / STATE
 *  ──────────────
 *  data-memory                         Persist progress in localStorage (on form wrapper)
 *  data-last-step                      Track last visited step in localStorage
 *
 *  SUBMIT / REDIRECT
 *  ─────────────────
 *  data-redirect="<url>"               Redirect after successful submit (on submit btn)
 *  data-redirect-delay="<ms>"          Delay before redirect (on form, default 100)
 *  data-new-tab="false"                Open redirect in same tab (default: new tab)
 *  data-success-card="<name>"          Show a success card on submit (on submit btn)
 *  data-wait="<text>"                  Custom "please wait" text (on submit btn)
 *  data-form-reset                     Reset form after submit (on form)
 *  data-reset-delay="<ms>"             Delay before reset (on form, default 2000)
 *
 *  CLONING (ADD/REMOVE FIELDS)
 *  ───────────────────────────
 *  data-clone="<name>"                 Clonable element
 *  data-clone-wrapper="<name>"         Wrapper for clones
 *  data-form="remove-clone"            Remove clone button
 *  data-add-new="<name>"               Add clone button
 *  data-add-new-limit="<n>"            Max clones
 *  data-clone-input="<name>"           Clonable input group
 *  data-clone-input-wrapper="<name>"   Wrapper for input clones
 *  data-form="remove-input-clone"      Remove input clone button
 *  data-add-new-input="<name>"         Add input clone button
 *  data-add-new-input-limit="<n>"      Max input clones
 *
 *  MISC
 *  ────
 *  data-enter="true"                   Enter key advances to next step
 *  data-submit                         ⌘/Ctrl + Enter submits on last step
 *  data-quiz                           Quiz/scoring mode
 *  data-weighted-selection             Weighted scoring
 *  data-weighted-selection-range       Range-based weighted results
 *  data-select-multiple                Allow multiple select values
 *  data-reinit                         Reinitialize Webflow interactions on step change
 *  data-scroll-top                     Scroll to form top on step change (on form)
 *  data-scroll-top-offset="<px>"       Offset pixels for scroll (on form wrapper)
 *  data-query-param                    Prefill from URL query params (on form wrapper)
 *  data-callback="recaptcha"           reCAPTCHA support
 *  data-count-card                     Count card steps in progress
 *  data-btn="edit"                     Edit/jump-to-step button
 *  data-btn="reset"                    Full form reset button
 *  data-submit-show                    Keep next btn visible on last step alongside submit
 *  data-debug-mode                     Debug/support panel param
 *  data-cms-select="cms"               Populate <select> from CMS list
 *  data-range="selection"              Quiz result range container
 *  data-selection="<value>"            Quiz result display
 *  data-selection="other"              Fallback quiz result
 *  data-text="total-weight"            Total quiz weight display
 *  data-prefill="false"                Skip prefill for a select
 *  data-remove-upload                  Clear file input
 */

(function () {
  "use strict";

  /* ───── jQuery guard ───── */
  if (typeof window.jQuery === "undefined" && typeof window.$ === "undefined") {
    console.error("[Multistep] jQuery is required.");
    return;
  }
  var $ = window.jQuery || window.$;

  /* ============================================================
   *  STATE
   * ============================================================ */
  let x = 0;                 // current step index
  let lastStep = 0;
  let curStep = 0;
  let progress = 0;          // furthest step reached
  let fill = false;           // whether current step is valid
  let skip = false;
  let next = false;           // branching active
  let back = false;
  let answer = "";
  let selections = [];        // branching history {step, selected, skipTo?, backTo?}
  let filledInput = [];       // saved input values for memory
  let allData = [];           // all field data for conditional logic
  let selArr = [];            // weighted selection accumulator
  let selString = [];         // quiz selection string accumulator
  let unfilledArr = [];       // current validation errors [{input: name}]
  let domainAllowed = true;
  let notRobot = true;
  let checkCount = 0;

  // Per-type validation trackers
  let inputFilled, radioFilled, checkboxFilled, numFilled, fileFilled;
  let dateFilled, timeFilled, selectFilled, textareaFilled, telFilled;
  let emailFilled, passwordFilled, urlFilled;

  let empReqInput, empReqUrl, empReqDate, empReqTime, empReqRadio;
  let empReqSelect, empReqTextarea, empReqFile, empReqPassword;
  let empReqNum, empReqTel;

  /* ───── DOM references ───── */
  const $form        = $('[data-form="multistep"]');
  const $wrapper      = $form.closest('[data-form="multistep"]').length ? $form : $form.parents().first();
  const steps         = $('[data-form="step"]');
  const $nextBtn      = $('[data-form="next-btn"]');
  const $backBtn      = $('[data-form="back-btn"]');
  const $submitBtn    = $('[data-form="submit-btn"]');
  const $submitBtnMs  = $('[data-form-ms="submit-btn"]');
  const $progressWrap = $('[data-form="progress"]');

  /* ───── Config from attributes ───── */
  const formContainer   = $('[data-form="multistep"]').closest("form").length
                          ? $('[data-form="multistep"]')
                          : $('form[data-form="multistep"]');
  const formWrapper     = $('[data-form="multistep"]');

  const customError           = !!formWrapper.data("custom-error-message") || $("[data-custom-error-message]").length > 0;
  const reinitIX              = !!$("[data-reinit]").data("reinit");
  const memory                = !!$("[data-memory]").data("memory") || !!formWrapper.data("memory");
  const quiz                  = !!$("[data-quiz]").data("quiz");
  const logicExtra            = !!formWrapper.data("logic-extra");
  const phoneFormat           = formWrapper.data("phone-format");
  const scrollToTop           = formWrapper.data("scroll-top");
  const trackLastStep         = !!$("[data-last-step]").data("last-step");
  const conditionalResult     = $("[data-conditional-result]").data("conditional-result") === "AND";
  const scrollTopOffset       = parseInt(formWrapper.data("scroll-top-offset")) || 0;
  const formReset             = formWrapper.data("form-reset");
  const resetDelay            = formWrapper.data("reset-delay") || 2000;
  const redirectDelay         = $("[data-redirect-delay]").data("redirect-delay") || 100;
  const countCard             = $("[data-count-card]").length > 0 ? $("[data-count-card]").data("count-card") : true;
  const _params               = !!formWrapper.data("query-param");
  const weightedSelection     = !!$("[data-weighted-selection]").data("weighted-selection");
  const weightedSelectionRange = !!$("[data-weighted-selection-range]").data("weighted-selection-range");
  const selectMultiple        = !!$("[data-select-multiple]").data("select-multiple");

  const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;

  let oldSubmitText = $submitBtn.val() || $submitBtn.text();
  let oldResetText  = $('[data-btn="reset"]').text();
  let redirectTo    = "";
  let newTab        = true;
  let successCard   = "";
  let totalSteps    = 0;
  let skipTo        = 0;
  let searchQ       = [];

  /* ───── Clone originals storage ───── */
  const ogCloneArr = [];
  $("[data-clone]").each(function () {
    ogCloneArr.push({
      name: $(this).data("clone"),
      element: $(this).clone(true),
      display: $('[data-display="' + $(this).data("clone") + '"]').eq(0).clone(true),
    });
  });

  /* ───── reCAPTCHA ───── */
  if ($("div.g-recaptcha").length > 0) notRobot = false;
  window.recaptcha = function () { notRobot = true; };

  /* ───── localStorage restore ───── */
  let savedFilledInput = null;
  let formlyLastStep = null;
  let formlyLastStepAnswer = null;
  try {
    savedFilledInput = JSON.parse(localStorage.getItem("filledInput"));
    formlyLastStep = JSON.parse(localStorage.getItem("formlyLastStep"));
    formlyLastStepAnswer = JSON.parse(localStorage.getItem("formlyLastStepAnswer"));
  } catch (e) { /* ignore */ }

  if (trackLastStep) {
    if (formlyLastStep > x) x = formlyLastStep;
    if (formlyLastStepAnswer) selections = formlyLastStepAnswer;
  }

  /* ───── Initial card/next detection ───── */
  if ($(steps[x]).data("card") || $(steps[x]).find(".active-answer-card").data("card")) {
    next = true;
  }

  /* ============================================================
   *  PROGRESS INDICATOR SETUP
   * ============================================================ */
  const $indicatorTemplate = $('[data-form="progress-indicator"]').clone();
  let progressbar;

  // Hide elements initially
  $('[data-text="error-message"]').hide();
  $($indicatorTemplate).removeClass("current");
  $('[data-form="progress"]').children().remove();
  $submitBtn.hide();
  $submitBtnMs.hide();

  // Create one indicator per step
  steps.each(function () {
    $('[data-form="progress"]').append($indicatorTemplate.clone(true, true));
  });
  $("[data-input-field]").hide();

  // Calculate total steps
  if (countCard) {
    curStep = 1;
    totalSteps = steps.length;
    $('[data-text="total-steps"]').text(totalSteps);
  } else {
    if ($(steps[x]).data("card")) {
      curStep = 0;
    } else {
      curStep = 1;
    }
    totalSteps = $('[data-form="step"]:not([data-card="true"])').length;
    $('[data-text="total-steps"]').text(totalSteps);
    // Hide indicators for card steps
    $('[data-form="step"][data-card]').each(function () {
      $($('[data-form="progress-indicator"]')[$(this).index()]).hide();
    });
  }

  progressbar = $('[data-form="progress"]').children();
  $('[data-form="progress-indicator"]').on("click", clickableIndicator);
  $('[data-text="current-step"]').text(curStep);
  steps.hide();
  $('[data-form="back-btn"]').hide();

  // Remove required on hidden inputs
  $('[data-form="step"]').each(function () {
    $(this).find(":input").attr("tabindex", "-1");
  });

  /* ───── Quiz mode: disable submit on steps ───── */
  if (quiz) {
    steps.each(function () {
      $(this).children().attr("novalidate", true);
      $(this).children().attr("autocomplete", "off");
    });
  }

  /* ───── Weighted selection range labels ───── */
  if (weightedSelectionRange) {
    $("[data-range]").each(function () {
      $(this).append('<div data-range="selection" style="display:none !important">' + $(this).data("range") + "</div>");
    });
  }

  /* ============================================================
   *  UTILITY FUNCTIONS
   * ============================================================ */
  function getSafe(fn, fallback) {
    try { return fn(); } catch (e) { return fallback; }
  }

  function phoneAutoFormat(format) {
    let prev = "";
    return function (val) {
      let cleaned = val.replace(/\D/g, "");
      let result = "";
      let ci = 0, fi = 0;
      while (ci < cleaned.length && fi < format.length) {
        if (format[fi] === "x") {
          result += cleaned[ci];
          ci++;
        } else {
          result += format[fi];
        }
        fi++;
      }
      if (val.length < prev.length) {
        let tail = format.slice(fi);
        result += tail.replace(/x/g, "");
      }
      prev = result;
      return result;
    };
  }

  function validateURL(val) {
    return urlPattern.test(val);
  }

  function validateEmail(val, blockedDomains, inputName) {
    let domain = val.includes("@") ? val.split("@")[1].split(".")[0] : "";
    let dom = [];
    if (blockedDomains !== undefined && blockedDomains) {
      blockedDomains.split(",").forEach(function (d) {
        if (d.trim().includes(domain) && domain !== "") dom.push(domain);
      });
    }
    domainAllowed = dom.length === 0;
    const emailRegex = /^([\w\-.+]+@([\w-]+\.)+[\w-]{2,20})?$/;
    if (!emailRegex.test(val) || !domainAllowed) {
      emailFilled = false;
      unfilledArr.push({ input: inputName });
    } else {
      emailFilled = true;
    }
  }

  function phoneValidation(val, len, min) {
    return len >= min;
  }

  function getParams() {
    const url = new URL(window.location.href);
    url.searchParams.forEach(function (val, key) {
      searchQ.push({ val: val, key: key });
    });
  }

  /* ============================================================
   *  SCROLL TO TOP
   * ============================================================ */
  function scrollTop() {
    if (scrollToTop) {
      $("html, body").animate(
        { scrollTop: formWrapper.offset().top - scrollTopOffset },
        1000
      );
    }
  }

  /* ============================================================
   *  BUTTON STATE
   * ============================================================ */
  function disableBtn() {
    fill = false;
    if (!customError) {
      $nextBtn.css({ opacity: "0.4", "pointer-events": "none" }).addClass("disabled");
      $submitBtn.css({ opacity: "0.4", "pointer-events": "none" }).addClass("disabled");
      $submitBtnMs.css({ opacity: "0.4", "pointer-events": "none" }).addClass("disabled");
    }
  }

  function enableBtn() {
    fill = true;
    $nextBtn.css({ "pointer-events": "auto", opacity: "1" }).removeClass("disabled");
    $submitBtn.css({ "pointer-events": "auto", opacity: "1" }).removeClass("disabled");
    $submitBtnMs.css({ "pointer-events": "auto", opacity: "1" }).removeClass("disabled");
  }

  /* ============================================================
   *  ERROR MESSAGES  ★ FULL CUSTOM ERROR SUPPORT ★
   * ============================================================ */
  function displayErrorMessage() {
    // Hide all error messages first
    $('[data-text="error-message"]').hide();

    if (unfilledArr.length > 0) {
      unfilledArr.forEach(function (item) {
        const name = item.input;
        // Show sibling error messages
        $('input[name="' + name + '"]').siblings('[data-text="error-message"]').fadeIn();
        // Show parent-level error messages
        $('input[name="' + name + '"]').parents().children('[data-text="error-message"]').fadeIn();
        // Show for textarea
        $('textarea[name="' + name + '"]').siblings('[data-text="error-message"]').fadeIn();
        // Show for select
        $('select[name="' + name + '"]').siblings('[data-text="error-message"]').fadeIn();
        $('select[name="' + name + '"]').parents().children('[data-text="error-message"]').fadeIn();
      });
    }
  }

  function resetInputErrorMessage(name) {
    $('input[name="' + name + '"]').siblings('[data-text="error-message"]').hide();
    $('input[name="' + name + '"]').parents().children('[data-text="error-message"]').hide();
    $('textarea[name="' + name + '"]').siblings('[data-text="error-message"]').hide();
    $('select[name="' + name + '"]').siblings('[data-text="error-message"]').hide();
    $('select[name="' + name + '"]').parents().children('[data-text="error-message"]').hide();
  }

  /* ============================================================
   *  STEP COUNTER
   * ============================================================ */
  function increaseCurstep() {
    if (countCard) {
      curStep++;
      $('[data-text="total-steps"]').text(steps.length);
    } else {
      if (!$(steps[x]).data("card")) curStep++;
    }
    $('[data-text="current-step"]').text(curStep);
  }

  function decreaseCurstep() {
    if (countCard) {
      curStep--;
      $('[data-text="total-steps"]').text(steps.length);
    } else {
      if (!$(steps[x]).data("card")) curStep--;
    }
    $('[data-text="current-step"]').text(curStep);
  }

  /* ============================================================
   *  SAVE / RESTORE (MEMORY)
   * ============================================================ */
  function saveLastAnswer(sel) {
    localStorage.removeItem("formlyLastStepAnswer");
    localStorage.setItem("formlyLastStepAnswer", JSON.stringify(sel));
  }

  function saveFilledInput() {
    $('form[data-form="multistep"] :input')
      .not('[type="submit"]')
      .each(function () {
        const type = $(this).attr("type");
        const name = $(this).attr("name");
        if (type === "checkbox" || type === "radio") {
          if ($(this).is(":checked")) {
            filledInput = filledInput.filter((f) => f.inputName !== name);
            if ($(this).val() !== "") {
              filledInput.push({ inputName: name, value: $(this).val() });
            }
          }
        } else {
          filledInput = filledInput.filter((f) => f.inputName !== name);
          if ($(this).val() !== "") {
            filledInput.push({ inputName: name, value: $(this).val() });
          }
        }
      });

    if (trackLastStep) {
      lastStep = formlyLastStep > x ? formlyLastStep : x;
      localStorage.removeItem("formlyLastStep");
      localStorage.setItem("formlyLastStep", lastStep);
    }
    localStorage.removeItem("filledInput");
    localStorage.setItem("filledInput", JSON.stringify(filledInput));
  }

  /* ============================================================
   *  CLONE MANAGEMENT
   * ============================================================ */
  function cloneRemove() {
    $("[data-clone-wrapper]").each(function () {
      if ($(this).find("[data-clone]").length < 2) {
        $(this).find('[data-form="remove-clone"]').hide();
      } else {
        $(this).find('[data-form="remove-clone"]').show();
      }
    });
  }

  function cloneRemoveInput() {
    $("[data-clone-input-wrapper]").each(function () {
      if ($(this).find("[data-clone-input]").length < 2) {
        $(this).find('[data-form="remove-input-clone"]').hide();
      } else {
        $(this).find('[data-form="remove-input-clone"]').show();
      }
    });
  }

  /* ============================================================
   *  VALIDATION ENGINE
   * ============================================================ */
  function validation() {
    // If step is a card with no required inputs, enable
    if ($(steps[x]).data("card")) {
      enableBtn();
    }

    // Reset all trackers
    unfilledArr = [];
    inputFilled = true;
    radioFilled = true;
    checkboxFilled = true;
    numFilled = true;
    fileFilled = true;
    dateFilled = true;
    timeFilled = true;
    selectFilled = true;
    textareaFilled = true;
    telFilled = true;
    emailFilled = true;
    passwordFilled = true;
    urlFilled = true;

    empReqInput = [];
    empReqDate = [];
    empReqTime = [];
    empReqSelect = [];
    empReqTel = [];
    empReqTextarea = [];
    empReqNum = [];
    empReqFile = [];
    empReqRadio = [];
    empReqPassword = [];

    const $step = $(steps[x]);
    const textareaLen = $step.find("textarea[required]:visible").length;
    const textInputLen = $step.find(':input[type="text"][required]').length;
    const selectInputLen = $step.find("select[required]:visible").length;
    const emailInputLen = $step.find(':input[type="email"]:visible').length;
    const checkboxInputLen = $step.find(':input[type="checkbox"]:visible').length;

    // Quick check: if required text/select/textarea exist, disable initially
    if (textInputLen > 0 || selectInputLen > 0 || textareaLen > 0) {
      disableBtn();
    } else {
      enableBtn();
    }

    // Determine checkbox count requirement
    checkCount = $step.data("checkbox")
      ? $step.data("checkbox")
      : $step.find("[data-checkbox]").length > 0
        ? $step.find("[data-checkbox]").data("checkbox")
        : 0;

    // Determine validation context (logicExtra or standard)
    const $context = logicExtra ? $step.find(".active-answer-card") : $step;
    const useActiveCard = logicExtra && $context.length > 0;

    // ─── Handle card/answer branching ───
    if ($step.data("card")) {
      if ($step.find("[data-go-to]").data("go-to")) {
        answer = $step.find("[data-go-to]").data("go-to");
        selections = selections.filter((s) => s.step !== x);
        selections.push({ step: x, selected: answer });
        next = true;
        back = false;
      }
    } else if ($step.find(".active-answer-card").data("card")) {
      answer = $step.find(".active-answer-card").data("go-to");
      selections = selections.filter((s) => s.step !== x);
      selections.push({ step: x, selected: answer });
      next = true;
      back = false;
    }

    // Helper to get the right container for field validation
    const $vc = (useActiveCard && $step.find(".active-answer-card").length > 0)
      ? $step.find(".active-answer-card")
      : $step;

    // ─── CHECKBOX validation ───
    const $checkboxes = $vc.find(':input[type="checkbox"]:visible');
    if ($checkboxes.is(":visible") && $checkboxes.length > 0) {
      if (checkCount === "*" || checkCount > $checkboxes.length) {
        // Each checkbox must be checked
        $checkboxes.each(function () {
          if ($(this).is(":checked")) {
            checkboxFilled = true;
            if ($step.find(':input[type="checkbox"][required]:not(:checked)').length < 1) {
              resetInputErrorMessage($(this).attr("name"));
            }
          } else {
            checkboxFilled = false;
            unfilledArr.push({ input: $(this).attr("name") });
          }
        });
      } else if ($vc.find(':input[type="checkbox"]:checked').length >= checkCount) {
        checkboxFilled = true;
        if ($step.find(':input[type="checkbox"]:checked').length >= $step.find(':input[type="checkbox"][required]').length) {
          resetInputErrorMessage($step.find(':input[type="checkbox"]').attr("name"));
        }
      } else {
        checkboxFilled = false;
        $step.find(':input[type="checkbox"][required]').each(function () {
          if ($(this).not(":checked")) {
            unfilledArr.push({ input: $(this).attr("name") });
          }
        });
      }
    }

    // ─── RADIO validation ───
    $vc.find("input:radio[required]").each(function (idx) {
      const radioName = $(this).attr("name");
      if ($('input:radio[name="' + radioName + '"]:checked').length === 0) {
        if (!empReqRadio.find((r) => r.input === idx)) {
          empReqRadio.push({ input: idx });
        }
        unfilledArr.push({ input: $(this).attr("name") });
      } else {
        empReqRadio = empReqRadio.filter((r) => r.input !== idx);
      }
      radioFilled = empReqRadio.length === 0;
    });

    // ─── TEXT INPUT validation ───
    $vc.find(':input[type="text"][required]').each(function (idx) {
      const len = $(this).val().length;
      const minChar = $(this).data("min-character") || 0;
      if ($(this).val() !== "" && len >= minChar) {
        empReqInput = empReqInput.filter((r) => r.input !== idx);
      } else {
        if (!empReqInput.find((r) => r.input === idx)) empReqInput.push({ input: idx });
        unfilledArr.push({ input: $(this).attr("name") });
      }
      inputFilled = empReqInput.length === 0;
    });

    // ─── PASSWORD validation ───
    $vc.find(':input[type="password"][required]').each(function (idx) {
      const len = $(this).val().length;
      const minChar = $(this).data("min-character") || 0;
      if ($(this).val() !== "" && len >= minChar) {
        empReqPassword = empReqPassword.filter((r) => r.input !== idx);
      } else {
        if (!empReqPassword.find((r) => r.input === idx)) empReqPassword.push({ input: idx });
        unfilledArr.push({ input: $(this).attr("name") });
      }
      passwordFilled = empReqPassword.length === 0;
    });

    // ─── URL validation ───
    $vc.find(':input[type="url"][required]').each(function (idx) {
      const len = $(this).val().length;
      const minChar = $(this).data("min-character") || 0;
      if ($(this).val() !== "" && len >= minChar && validateURL($(this).val())) {
        empReqUrl = (empReqUrl || []).filter((r) => r.input !== idx);
      } else {
        empReqUrl = empReqUrl || [];
        if (!empReqUrl.find((r) => r.input === idx)) empReqUrl.push({ input: idx });
        unfilledArr.push({ input: $(this).attr("name") });
      }
      urlFilled = !empReqUrl || empReqUrl.length === 0;
    });

    // ─── TIME validation ───
    $vc.find(':input[type="time"][required]').each(function (idx) {
      if ($(this).val() !== "") {
        empReqTime = empReqTime.filter((r) => r.input !== idx);
      } else {
        if (!empReqTime.find((r) => r.input === idx)) empReqTime.push({ input: idx });
        unfilledArr.push({ input: $(this).attr("name") });
      }
      timeFilled = empReqTime.length === 0;
    });

    // ─── DATE validation ───
    $vc.find(':input[type="date"][required]').each(function (idx) {
      if ($(this).val() !== "") {
        empReqDate = empReqDate.filter((r) => r.input !== idx);
      } else {
        if (!empReqDate.find((r) => r.input === idx)) empReqDate.push({ input: idx });
        unfilledArr.push({ input: $(this).attr("name") });
      }
      dateFilled = empReqDate.length === 0;
    });

    // ─── TEL validation ───
    $vc.find(':input[type="tel"][required]').each(function (idx) {
      if ($(this).val() !== "") {
        const len = $(this).val().length;
        const minChar = $(this).data("min-character") || 0;
        // Auto-format
        if ($(this).data("phone-autoformat")) {
          const formatter = phoneAutoFormat($(this).data("phone-autoformat"));
          $(this).val(formatter($(this).val()));
        }
        if (phoneValidation($(this).val(), len, minChar)) {
          empReqTel = empReqTel.filter((r) => r.input !== idx);
        } else {
          empReqTel.push({ input: idx });
        }
      } else {
        if (!empReqTel.find((r) => r.input === idx)) empReqTel.push({ input: idx });
        unfilledArr.push({ input: $(this).attr("name") });
      }
      telFilled = empReqTel.length === 0;
    });

    // ─── FILE validation ───
    $vc.find(':input[type="file"][required]').each(function (idx) {
      if ($(this).val() !== "") {
        empReqFile = empReqFile.filter((r) => r.input !== idx);
      } else {
        if (!empReqFile.find((r) => r.input === idx)) empReqFile.push({ input: idx });
        unfilledArr.push({ input: $(this).attr("name") });
      }
      fileFilled = empReqFile.length === 0;
    });

    // ─── NUMBER validation ───
    $vc.find(':input[type="number"][required]').each(function (idx) {
      const len = $(this).val().length;
      const minChar = $(this).data("min-character") || 0;
      if ($(this).val() !== "" && len >= minChar) {
        empReqNum = empReqNum.filter((r) => r.input !== idx);
      } else {
        if (!empReqNum.find((r) => r.input === idx)) empReqNum.push({ input: idx });
        unfilledArr.push({ input: $(this).attr("name") });
      }
      numFilled = empReqNum.length === 0;
    });

    // ─── SELECT validation ───
    $vc.find("select[required]").each(function (idx) {
      let val = $(this).val();
      if (val === "") val = null;
      if (val != null) {
        empReqSelect = empReqSelect.filter((r) => r.input !== idx);
      } else {
        if (!empReqSelect.find((r) => r.input === idx)) empReqSelect.push({ input: idx });
        unfilledArr.push({ input: $(this).attr("name") });
      }
      selectFilled = empReqSelect.length === 0;
    });

    // ─── TEXTAREA validation ───
    $vc.find("textarea[required]").each(function (idx) {
      const len = $(this).val().length;
      const minChar = $(this).data("min-character") || 0;
      if ($(this).val() !== "" && len >= minChar) {
        empReqTextarea = empReqTextarea.filter((r) => r.input !== idx);
      } else {
        if (!empReqTextarea.find((r) => r.input === idx)) empReqTextarea.push({ input: idx });
        unfilledArr.push({ input: $(this).attr("name") });
      }
      textareaFilled = empReqTextarea.length === 0;
    });

    // ─── EMAIL validation ───
    $vc.find(':input[type="email"][required]').each(function () {
      if ($(this).val() !== "") {
        validateEmail($(this).val(), $(this).data("domain-not-allowed"), $(this).attr("name"));
      } else {
        emailFilled = false;
        unfilledArr.push({ input: $(this).attr("name") });
      }
    });

    // ─── Handle radio skip auto-advance within active answer cards ───
    handleRadioSkipLogic($step, $vc);

    // ─── Handle go-to / skip-to branching from active answer cards ───
    handleBranchingLogic($step, $vc);

    // ─── Final enable/disable ───
    if (inputFilled && fileFilled && numFilled && checkboxFilled && telFilled &&
        radioFilled && emailFilled && domainAllowed && selectFilled &&
        textareaFilled && passwordFilled && urlFilled && dateFilled && timeFilled) {
      enableBtn();
    } else {
      disableBtn();
    }

    andLogic();
    cloneRemove();
    cloneRemoveInput();
  }

  /* ─── Branching logic handler ─── */
  function handleBranchingLogic($step, $vc) {
    // Radio go-to
    $vc.find(':input[type="radio"]:checked').each(function () {
      skipTo = undefined;
      const $skipParent = $(this).parents("[data-skip-to]");
      if ($skipParent.data("skip-to")) {
        skipTo = $skipParent.data("skip-to");
      }
      const $goToParent = $(this).parents("[data-go-to]");
      if ($goToParent.attr("data-go-to")) {
        answer = $goToParent.attr("data-go-to");
        selections = selections.filter((s) => s.step !== x);
        selections.push({ step: x, selected: answer });
        if (skipTo) {
          selections = selections.filter((s) => s.step !== skipTo - 2);
          selections.push({ step: skipTo - 2, selected: answer });
          const objIndex = selections.findIndex((s) => s.step === x);
          selections[objIndex].skipTo = parseInt(skipTo) - 1;
          selections[objIndex].backTo = x;
        }
      }
      // data-go-to directly on the input
      if ($(this).data("go-to")) {
        answer = $(this).attr("data-go-to");
        selections = selections.filter((s) => s.step !== x);
        selections.push({ step: x, selected: answer });
      }
    });

    // Select go-to
    $vc.find("select:visible").each(function () {
      skipTo = undefined;
      const $skipParent = $(this).parents("[data-skip-to]");
      if ($skipParent.data("skip-to")) skipTo = $skipParent.data("skip-to");
      const $goToParent = $(this).parents("[data-go-to]");
      if ($goToParent.attr("data-go-to")) {
        answer = $goToParent.attr("data-go-to");
        selections = selections.filter((s) => s.step !== x);
        selections.push({ step: x, selected: answer });
        if (skipTo) {
          selections = selections.filter((s) => s.step !== skipTo - 2);
          selections.push({ step: skipTo - 2, selected: answer });
          const objIndex = selections.findIndex((s) => s.step === x);
          selections[objIndex].skipTo = parseInt(skipTo) - 1;
          selections[objIndex].backTo = x;
        }
      }
    });

    // Text/Textarea/Number/File/Date/Time/Tel/Password go-to (inside active answer cards)
    const inputTypes = [
      ':input[type="text"]:visible',
      ':input[type="number"]:visible',
      ':input[type="tel"]:visible',
      ':input[type="date"]:visible',
      ':input[type="time"]:visible',
      ':input[type="file"]:visible',
      ':input[type="password"]:visible',
      ':input[type="email"]:visible',
      "textarea:visible",
    ];
    inputTypes.forEach(function (sel) {
      $vc.find(sel).each(function () {
        skipTo = undefined;
        const $skipParent = $(this).parents("[data-skip-to]");
        if ($skipParent.data("skip-to") !== "") skipTo = $skipParent.data("skip-to");
        const $goToParent = $(this).parents("[data-go-to]");
        if ($goToParent.attr("data-go-to")) {
          answer = $goToParent.attr("data-go-to");
          selections = selections.filter((s) => s.step !== x);
          selections.push({ step: x, selected: answer });
          if (skipTo) {
            selections = selections.filter((s) => s.step !== skipTo - 2);
            selections.push({ step: skipTo - 2, selected: answer });
            const objIndex = selections.findIndex((s) => s.step === x);
            selections[objIndex].skipTo = parseInt(skipTo) - 1;
            selections[objIndex].backTo = x;
          }
        }
      });
    });
  }

  /* ─── Radio skip logic handler ─── */
  function handleRadioSkipLogic($step, $vc) {
    const hasRadioSkip =
      $vc.find("[data-radio-skip]:visible").data("radio-skip") === true ||
      $step.find("[data-radio-skip]:visible").data("radio-skip") === true ||
      $step.find("[data-answer][data-radio-skip]:visible").data("radio-skip") === true;

    if (hasRadioSkip && skip) {
      const textareaLen = $step.find("textarea[required]:visible").length;
      const textInputLen = $step.find(':input[type="text"][required]').length;
      const emailLen = $step.find(':input[type="email"]:visible').length;
      const checkboxLen = $step.find(':input[type="checkbox"]:visible').length;

      if (textareaLen === 0 && textInputLen === 0 && emailLen === 0 && checkboxLen === 0) {
        const delay = $step.find("[data-radio-delay]").data("radio-delay") || 250;
        if (selections.filter((s) => s.step === x).length > 0 || !logicExtra) {
          setTimeout(function () {
            next = true;
            back = false;
            nextStep();
            selectionQuiz();
          }, delay);
        }
      }
    }
  }

  /* ============================================================
   *  UPDATE STEP (show/hide logic)
   * ============================================================ */
  function updateStep() {
    scrollTop();
    skip = false;
    $('[data-form="progress-indicator"]').removeClass("disabled");

    // Handle submit button disabled class on steps with required inputs
    if ($('[data-form="multistep"]').data("debug-mode")) {
      let emptyCount = 0;
      steps.find(":input[required]").each(function () {
        if ($(this).val() === "") emptyCount++;
      });
      if (emptyCount > 0) {
        $('input[type="submit"]').addClass("disabled");
      } else {
        $('input[type="submit"]').removeClass("disabled");
      }
    }

    // Update progress indicators
    $('[data-form="progress-indicator"]').removeClass("current").addClass("disabled");
    $($('[data-form="progress-indicator"]')[x]).addClass("current");

    // Handle branching selection
    let selection = selections.filter((s) => s.step === x - 1);
    if (next) {
      const skipTarget = getSafe(() => selection[0].skipTo);
      if (skipTarget) x = parseInt(skipTarget);
    }

    // Hide all answer divs and steps
    $("[data-answer]").hide();
    steps.hide();

    // Update progress bar highlights
    $(progressbar).removeClass("current");
    for (let i = 0; i <= x; i++) {
      if (countCard) {
        $(progressbar[i]).addClass("current");
      } else {
        if (!$(steps[i]).data("card")) {
          $(progressbar[i]).addClass("current");
        }
      }
    }

    // Show current step with animation
    if (reinitIX) {
      if (window.Webflow) {
        window.Webflow.require("ix2").init();
      }
      document.dispatchEvent(new Event("readystatechange"));
      $(steps[x]).fadeIn();
    } else {
      $(steps[x]).fadeIn("fast");
    }

    // Remove active-answer-card class
    $(".active-answer-card").removeClass("active-answer-card");

    // Show first answer on step 0 if not a card
    if (x === 0 && !$(steps[x]).data("card")) {
      $(steps[x]).find("[data-answer]").show();
      $(steps[x]).find("[data-answer]").addClass("active-answer-card");
    }

    // Show the right answer based on selection
    if (selection.length > 0) {
      $(steps[x]).find('[data-answer="' + selection[0].selected + '"]').fadeIn();
      $(steps[x]).find('[data-answer="' + selection[0].selected + '"]').addClass("active-answer-card");
    } else {
      $(steps[x]).find('[data-answer="' + answer + '"]').show();
      $(steps[x]).find('[data-answer="' + answer + '"]').addClass("active-answer-card");
    }

    // Button visibility
    if (x === 0) {
      $backBtn.hide();
      $nextBtn.show();
      $submitBtn.hide();
    } else if (x === steps.length - 1 || $(steps[x]).find('[data-form="submit-btn"]').length > 0) {
      // Last step or step with submit button
      $nextBtn.hide();

      // Handle submit-show (show next btn alongside submit on last step)
      if ($(steps[x]).find('[data-form="next-btn"][data-submit-show]').data("submit-show")) {
        $(steps[x]).find('[data-form="next-btn"][data-submit-show]').show();
      } else if ($nextBtn.data("submit-show")) {
        $nextBtn.show();
      }

      $submitBtn.show();
      $submitBtnMs.show();
      $backBtn.show();
    } else {
      $nextBtn.show();
      $backBtn.show();
      $submitBtn.hide();
      $submitBtnMs.hide();
    }

    // Focus first input
    $($(steps[x]).find("input[autofocus]")[0]).focus();
    $($(steps[x]).find("textarea[autofocus]")[0]).focus();

    // Run validation
    validation();

    // Enable visited indicators
    for (let idx = 0; idx <= x; idx++) {
      $($('[data-form="progress-indicator"]')[idx]).removeClass("disabled");
    }
  }

  /* ============================================================
   *  NEXT / BACK STEP
   * ============================================================ */
  function nextStep() {
    if (customError) {
      $('[data-text="error-message"]').hide();
      if (fill) {
        x++;
        increaseCurstep();
        progress = x;
        if (x <= steps.length - 1) {
          updateStep();
          if (memory) saveFilledInput();
        }
      } else {
        displayErrorMessage();
      }
    } else {
      x++;
      increaseCurstep();
      if (x > progress) progress = x;
      if (x <= steps.length - 1) {
        updateStep();
        if (memory) saveFilledInput();
      }
    }
    andLogic();
  }

  function backStep() {
    if (customError) $('[data-text="error-message"]').hide();
    decreaseCurstep();
    if (x > 0) {
      $(progressbar[x]).removeClass("current");
      // Handle skip-back
      const skipBackEntries = selections.filter((s) => s.skipTo === x);
      if (skipBackEntries.length > 0) {
        x = parseInt(getSafe(() => skipBackEntries[0].backTo));
      } else {
        x--;
      }
      updateStep();
    }

    // Reset radio skip state on back
    const $curStep = $(steps[x]);
    const hasRadioSkip =
      $curStep.find("[data-radio-skip]:visible").data("radio-skip") === true ||
      $curStep.find(".active-answer-card").find("[data-radio-skip]:visible").data("radio-skip") === true ||
      $curStep.find("[data-answer][data-radio-skip]:visible").data("radio-skip") === true;

    if (hasRadioSkip) {
      allData = allData.filter(
        (d) => d.field !== $curStep.find('input[type="radio"]:checked').attr("name")
      );
      const radioName = $curStep.find('input[type="radio"]:checked').attr("name");
      if (radioName) {
        $('[data-display-input-wrapper="' + radioName + '"]').hide();
      }
      $curStep.find('input[type="radio"]').prop("checked", false);
      $curStep.find(".w-form-formradioinput").removeClass("w--redirected-checked");
      validation();
    }
  }

  /* ============================================================
   *  SELECTION QUIZ
   * ============================================================ */
  function selectionQuiz() {
    if (!quiz) return;

    $("[data-range]").hide();
    $("[data-selection]").hide();

    if (weightedSelection) {
      let selTotal = 0;
      selArr.forEach(function (item) {
        selTotal += item.selected;
      });
      $('[data-text="total-weight"]').text(selTotal);

      if ($('[data-selection="' + selTotal + '"]').length > 0) {
        $('[data-selection="' + selTotal + '"]').fadeIn();
      } else {
        // Range-based
        const $rangeMatch = $("[data-range]:contains(" + selTotal + ")");
        if ($rangeMatch.length) {
          $rangeMatch.parent("[data-range]").eq(0).show();
        } else {
          $('[data-selection="other"]').fadeIn();
        }
      }
    } else {
      let matchIdx = -1;
      $("[data-range]").each(function (i) {
        if ($($(this)).data("range").includes(selString.join())) {
          matchIdx = i;
        }
      });
      if (matchIdx > -1) {
        $($("[data-range]")[matchIdx]).fadeIn();
      } else {
        $('[data-selection="other"]').fadeIn();
      }
    }
  }

  /* ============================================================
   *  AND-LOGIC CONDITIONAL SHOW/HIDE
   * ============================================================ */
  function andLogic() {
    if (!conditionalResult) return;

    steps.eq(x).find("[data-show-if]").hide();
    steps.eq(x).find("[data-show-if]").each(function () {
      const condition = $(this).attr("data-show-if");
      const pairs = condition.split("&").map(function (pair) {
        const [field, value] = pair.split("=");
        return { field, value };
      });

      const match = pairs.every(function (pair) {
        return allData.some(function (d) {
          return d.field === pair.field && d.value === pair.value;
        });
      });

      if (match) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }

  /* ============================================================
   *  PREFILL FROM MEMORY / URL PARAMS
   * ============================================================ */
  function triggerInputAllData() {
    if (savedFilledInput && memory) {
      savedFilledInput.forEach(function (item) {
        const $radioInput = $('input[name="' + item.inputName + '"][value="' + item.value + '"]');
        const $input = $('input[name="' + item.inputName + '"]');
        const $textarea = $('textarea[name="' + item.inputName + '"]');
        const $select = $('select[name="' + item.inputName + '"]');
        const $checkboxInput = $('input[type="checkbox"][name="' + item.inputName + '"][value="' + item.value + '"]');

        if ($radioInput.attr("type") !== "file") {
          if ($radioInput.attr("type") === "radio" && !$radioInput.parents("[data-radio-skip]").data("radio-skip")) {
            $radioInput.click();
            $radioInput.siblings(".w-radio-input").addClass("w--redirected-checked");
            $radioInput.trigger("input");
          } else if (item.value === "on") {
            $input.click();
            $input.siblings(".w-checkbox-input").addClass("w--redirected-checked");
            $input.trigger("input");
          } else {
            $input.val(item.value);
            $textarea.val(item.value);
            $select.find('option[value="' + item.value + '"]').prop("selected", true);
            $input.trigger("input");
            $input.trigger("change");
          }

          // Apply click-addclass
          const clickClass = $checkboxInput.data("click-addclass");
          const inputClickClass = $select.data("click-addclass");
          if (clickClass) $checkboxInput.parent().addClass(clickClass);
          if (inputClickClass) $select.parent().addClass(inputClickClass);
        }
      });
    } else if (_params) {
      getParams();
      searchQ.forEach(function (param) {
        const $radioInput = $('input[name="' + param.key + '"][value="' + param.val + '"]');
        const $input = $('input[name="' + param.key + '"]');
        const $textarea = $('textarea[name="' + param.key + '"]');
        const $select = $('select[name="' + param.key + '"]');

        if ($radioInput.attr("type") !== "file") {
          if ($radioInput.attr("type") === "radio") {
            $radioInput.click();
            $radioInput.siblings(".w-radio-input").addClass("w--redirected-checked");
            $radioInput.trigger("input");
          } else if (param.val === "on") {
            $input.click();
            $input.siblings(".w-checkbox-input").addClass("w--redirected-checked");
            $input.trigger("input");
          } else {
            $input.val(param.val);
            $textarea.val(param.val);
            $select.val(param.val);
            $input.trigger("input");
            $input.trigger("change");
          }
        }
      });
    }
  }

  /* ============================================================
   *  CLICKABLE PROGRESS INDICATOR
   * ============================================================ */
  function clickableIndicator() {
    if ($("[data-clickable]").length > 0) {
      const clickedIdx = $(this).index();
      if ($("[data-clickable]").data("clickable") === "true" || $("[data-clickable]").data("clickable") === true) {
        x = clickedIdx;
        updateStep();
      } else if (clickedIdx <= progress) {
        x = clickedIdx;
        updateStep();
      }
    }
    $('[data-text="current-step"]').text(x + 1);
  }

  $('[data-form="progress-indicator"]').on("click", clickableIndicator);

  /* ============================================================
   *  FORM RESET
   * ============================================================ */
  function resetFormly() {
    formWrapper.trigger("reset");
    formWrapper.parents().find(".w-form-done").hide();
    x = 0;
    curStep = 1;
    updateStep();
    formWrapper.show();
    $submitBtn.text(oldSubmitText).val(oldSubmitText);
    $('[data-text="current-step"]').text(1);
    formWrapper.find("input:checkbox").siblings(".w-checkbox-input").removeClass("w--redirected-checked");
  }

  /* ============================================================
   *  CMS SELECT POPULATE
   * ============================================================ */
  $("[data-cms-select=cms]").each(function () {
    const $items = $(this).find(".w-dyn-item");
    const values = [];
    $items.each(function () {
      values.push($(this).text().trim());
    });
    const $select = $(this).siblings("select");
    $.each(values, function (i, val) {
      const $option = $("<option>").val(val).text(val);
      $select.append($option);
    });
  });

  /* ============================================================
   *  EVENT HANDLERS
   * ============================================================ */

  // ─── NEXT BUTTON ───
  $nextBtn.on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    nextStep();
    selectionQuiz();
  });

  // ─── BACK BUTTON ───
  $backBtn.on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    backStep();
  });

  // ─── SUBMIT BUTTON ───
  $submitBtn.on("click", function (e) {
    if ($(this).data("redirect")) redirectTo = $(this).data("redirect");
    if ($(this).data("new-tab") === false) newTab = false;
    successCard = $(this).data("success") || "";

    e.preventDefault();
    e.stopPropagation();

    if (logicExtra) {
      $(this).prop("disabled", true);
      $(steps).find(":input").prop("required", false);
    }

    localStorage.removeItem("filledInput");

    if (fill) {
      // Update button text
      if ($(this).data("wait")) {
        $(this).text($(this).data("wait"));
        $(this).val($(this).data("wait"));
      } else {
        $(this).val("Please wait...").text("Please wait...");
      }

      // Submit the form
      $('[data-form="multistep"]').submit();

      // reCAPTCHA check
      if ($("div.g-recaptcha").length > 0 && typeof grecaptcha !== "undefined" && grecaptcha.getResponse().length === 0) {
        $submitBtn.text(oldSubmitText).val(oldSubmitText);
      }

      if (customError) $('[data-text="error-message"]').hide();
    } else if (customError) {
      displayErrorMessage();
    }
  });

  // ─── AJAX COMPLETE (Webflow form submission) ───
  $(document).ajaxComplete(function (event, xhr, settings) {
    if (settings.url && settings.url.includes("https://webflow.com/api/v1/form/")) {
      const success = xhr.status === 200;

      if (redirectTo && success) {
        if (newTab) {
          window.open(redirectTo, "_blank");
        } else {
          setTimeout(function () {
            location.href = redirectTo;
          }, redirectDelay);
        }
      }

      if (success && successCard !== "") {
        $('[data-success-card="' + successCard + '"]').fadeIn();
      }

      if (success && formReset) {
        setTimeout(function () {
          resetFormly();
        }, resetDelay);
      }

      if (!success) {
        $submitBtn.val("Please wait...").text("Please wait...");
      }
    }
  });

  // ─── EDIT BUTTON (jump to step) ───
  $('[data-btn="edit"]').on("click", function () {
    const inputName = $(this).parent().find("[data-input-field]").data("input-field");
    setTimeout(function () {
      $('input[name="' + inputName + '"]').focus();
    }, 100);
    back = true;
    x = $(this).data("edit-step") - 1;
    updateStep();

    if (countCard) {
      curStep = x + 1;
      $('[data-text="total-steps"]').text(steps.length);
    } else {
      curStep = $(steps[x]).data("card") ? x : x + 1;
    }
    $('[data-text="current-step"]').text(curStep);
    back = false;
  });

  // ─── RESET BUTTON ───
  $('[data-btn="reset"]').on("click", function () {
    $('[data-form="multistep"]').trigger("reset");
    const $btn = $(this);
    $btn.text("Please wait...");
    setTimeout(function () {
      $btn.text(oldResetText);
      $btn.parents(".w-form-done").hide();
      x = 0;
      updateStep();
      $('[data-form="multistep"]').show();
      $submitBtn.text(oldSubmitText).val(oldSubmitText);
      $('[data-text="current-step"]').text(1);
      formWrapper.find("input:checkbox").siblings(".w-checkbox-input").removeClass("w--redirected-checked");
    }, resetDelay);
  });

  // ─── ENTER KEY ───
  $('[data-enter="true"]').on("keypress", function (e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      if ($(steps[x]).find("textarea").is(":focus")) {
        // Allow newline in textarea
        $(steps[x]).find("textarea:focus").val($(steps[x]).find("textarea:focus").val() + "\n");
      } else {
        if ($("[data-enter]").data("enter") && fill && totalSteps > curStep) {
          $('[data-form="next-btn"]')[0].click();
        }
      }
    }
  });

  // ─── CMD/CTRL + ENTER TO SUBMIT ───
  $("body").keydown(function (e) {
    if ((e.metaKey || e.ctrlKey) && e.keyCode === 13) {
      if (x >= steps.length - 1 && fill) {
        $(steps[x]).find('[data-form="submit-btn"]:visible').click();
      } else {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  });

  // ─── INPUT CHANGE → VALIDATE + MIRROR ───
  formWrapper.find(":input").on("change", function () {
    // Update allData
    allData = allData.filter((d) => d.field !== $(this).attr("name"));
    if ($(this).attr("type") === "checkbox") {
      if ($(this).is(":checked")) {
        allData.push({ field: $(this).attr("name"), value: $(this).siblings("span").text() });
      } else {
        $('[data-display-input-wrapper="' + $(this).attr("name") + '"]').hide();
      }
    } else {
      allData.push({ field: $(this).attr("name"), value: $(this).val() });
      if ($(this).val() !== "") resetInputErrorMessage($(this).attr("name"));
    }
    // Mirror to display elements
    allData.forEach(function (d) {
      $('[data-display-input-wrapper="' + d.field + '"]').show().text(d.value);
    });
    validation();
  });

  formWrapper.find("textarea").on("change", function () {
    if ($(this).val() !== "") resetInputErrorMessage($(this).attr("name"));
    allData = allData.filter((d) => d.field !== $(this).attr("name"));
    allData.push({ field: $(this).attr("name"), value: $(this).val() });
    allData.forEach(function (d) {
      $('[data-display-input-wrapper="' + d.field + '"]').show().text(d.value);
    });
    validation();
  });

  formWrapper.find("select").on("change", function () {
    if ($(this).val() !== "") resetInputErrorMessage($(this).attr("name"));
    const useOptionText = $(this).data("ms-field");
    allData = allData.filter((d) => d.field !== $(this).attr("name"));
    allData.push({
      field: $(this).attr("name"),
      value: useOptionText ? $(this).find("option:selected").text() : $(this).val(),
    });
    allData.forEach(function (d) {
      $('[data-display-input-wrapper="' + d.field + '"]').show().text(d.value);
    });
    validation();
  });

  // ─── LIVE INPUT VALIDATION ───
  formWrapper.find(":input").on("input", function () {
    validation();
  });

  // ─── FINSWEET CUSTOM SELECT COMPATIBILITY ───
  // Finsweet custom selects update the native <select> but may not fire change.
  // Listen for clicks on the dropdown links and trigger change after a short delay.
  $(document).on("click", ".fs_selectcustom-1_link, [fs-selectcustom-element] .w-dropdown-link", function () {
    setTimeout(function () {
      formWrapper.find("select").each(function () {
        if ($(this).val() !== "") {
          resetInputErrorMessage($(this).attr("name"));
        }
      });
      validation();
    }, 100);
  });

  // Also observe native select mutations for any third-party select libs
  formWrapper.find("select").each(function () {
    var sel = this;
    if (typeof MutationObserver !== "undefined") {
      var obs = new MutationObserver(function () {
        $(sel).trigger("change");
      });
      obs.observe(sel, { childList: true, attributes: true, subtree: true });
    }
  });

  // ─── ANSWER CARD CLICKS ───
  $("[data-answer]").on("click", function () {
    const $thisAnswer = $(this);

    // Remove previous active
    $(steps[x]).find(".active-answer-card").removeClass("active-answer-card");
    $thisAnswer.addClass("active-answer-card");

    // Set go-to
    if ($thisAnswer.data("go-to")) {
      answer = $thisAnswer.data("go-to");
      selections = selections.filter((s) => s.step !== x);
      selections.push({ step: x, selected: answer });
      next = true;
      back = false;
    }

    // Handle skip-to on card
    if ($thisAnswer.data("skip-to")) {
      skipTo = $thisAnswer.data("skip-to");
      const objIndex = selections.findIndex((s) => s.step === x);
      if (objIndex > -1) {
        selections[objIndex].skipTo = parseInt(skipTo) - 1;
        selections[objIndex].backTo = x;
      }
    }

    // For quiz weighted selection
    if (quiz && weightedSelection) {
      selArr = selArr.filter((s) => s.step !== x);
      selArr.push({ step: x, selected: parseInt($thisAnswer.data("weighted-selection")) || 0 });
    }
    if (quiz) {
      selString = selString.filter((s, i) => i !== x);
      selString[x] = $thisAnswer.data("selection") || $thisAnswer.text().trim();
    }

    skip = true;
    validation();
  });

  // ─── RADIO INPUT CLICKS (with radio-skip) ───
  formWrapper.find('input[type="radio"]').on("click change", function () {
    skip = true;
    validation();
  });

  // ─── REMOVE UPLOAD ───
  $("[data-remove-upload]").on("click", function () {
    const inputName = $(this).siblings("[data-input-field]").data("input-field");
    $('input[name="' + inputName + '"]').val("");
    validation();
  });

  // ─── CLONE: ADD NEW ───
  $("[data-add-new]").on("click", function () {
    const cloneName = $(this).data("add-new");
    const limit = $(this).data("add-new-limit");

    const $clone = $('[data-clone="' + cloneName + '"]').eq(0).clone(true);
    const $displayClone = $('[data-display="' + cloneName + '"]').eq(0).clone(true);

    // Clear values and rename
    $clone.find(":input").val("");
    $clone.find("textarea").val("");
    $clone.find("select").val("");

    // Rename inputs
    let idx = $('[data-clone="' + cloneName + '"]').last().index() + 1;
    $clone.find(":input").each(function () {
      const newName = this.name + "-" + idx;
      $(this).val("").attr("name", newName).attr("data-name", newName);
    });
    $clone.find("textarea").each(function () {
      const newName = this.name + "-" + idx;
      $(this).val("").attr("name", newName).attr("data-name", newName);
    });
    $clone.find("select").each(function () {
      const newName = this.name + "-" + idx;
      $(this).val("").attr("name", newName).attr("data-name", newName);
    });

    // Append
    $('[data-clone-wrapper="' + cloneName + '"]').append($clone);
    $('[data-display-wrapper="' + cloneName + '"]').append($displayClone);

    // Check limit
    const totalClones = $('[data-clone-wrapper="' + cloneName + '"] [data-clone="' + cloneName + '"]').length;
    if (totalClones >= limit) {
      $(this).hide();
      return;
    }
    $(this).show();
    cloneRemove();
    validation();
  });

  // ─── CLONE: REMOVE ───
  $('[data-form="remove-clone"]').on("click", function () {
    const idx = $(this).parents("[data-clone]").length > 0
      ? $(this).parents("[data-clone]").index()
      : $(this).parents("[data-clone-wrapper]").index();
    const cloneName = $(this).parents("[data-clone]").length > 0
      ? $(this).parents("[data-clone]").data("clone")
      : $(this).parents("[data-clone-wrapper]").data("clone-input");

    $('[data-clone="' + cloneName + '"]').eq(idx).remove();
    $('[data-display="' + cloneName + '"]').eq(idx).remove();
    cloneRemove();

    // Show add button if under limit
    const limit = $('[data-add-new="' + cloneName + '"]').data("add-new-limit");
    const count = $('[data-clone="' + cloneName + '"]').length;
    if (count < limit) {
      $('[data-add-new="' + cloneName + '"]').show();
    }
    validation();
  });

  // ─── CLONE INPUT: ADD NEW ───
  $("[data-add-new-input]").on("click", function () {
    const inputName = $(this).parents("[data-clone-input]").data("clone-input") ||
                      $(this).data("add-new-input");
    const limit = $(this).data("add-new-input-limit") ||
                  $('[data-add-new-input="' + inputName + '"]').data("add-new-input-limit");

    const $source = $('[data-clone-input="' + inputName + '"]').eq(0);
    const $clone = $source.clone(true);

    // Clear and rename
    let idx = $('[data-clone-input="' + inputName + '"]').length;
    $clone.find(":input").each(function () {
      const newName = this.name + "-" + idx;
      $(this).val("").attr("name", newName).attr("data-name", newName);
    });
    $clone.find("textarea").each(function () {
      const newName = this.name + "-" + idx;
      $(this).val("").attr("name", newName).attr("data-name", newName);
    });
    $clone.find("select").each(function () {
      const newName = this.name + "-" + idx;
      $(this).val("").attr("name", newName).attr("data-name", newName);
    });

    $(this).siblings('[data-clone-input-wrapper="' + inputName + '"]').append($clone);

    const totalClones = $('[data-clone-input-wrapper="' + inputName + '"] [data-clone-input="' + inputName + '"]').length;
    if (totalClones >= limit) {
      $(this).hide();
      return;
    }
    $(this).show();
    cloneRemoveInput();
    validation();
  });

  // ─── CLONE INPUT: REMOVE ───
  $('[data-form="remove-input-clone"]').on("click", function () {
    $(this).parent("[data-clone-input]").remove();
    cloneRemoveInput();
    validation();
  });

  // ─── CLICK ADD CLASS (checkbox/radio styling) ───
  function addClickClass() {
    const cls = $(this).data("click-addclass");
    const name = $(this).attr("name");
    $('input[name="' + name + '"]').parent().removeClass(cls);
    if ($(this).is(":checked")) {
      $(this).parent().addClass(cls);
    }
  }
  $("[data-click-addclass]").on("change", addClickClass);

  // ─── PROGRESSIVE DISCLOSURE ───
  $("[data-progressive-input]").on("input", function () {
    const target = $(this).data("progressive-input");
    const val = $(this).val();
    const wildcard = $('[data-progressive-target="' + target + '"]').data("progressive-input-value");

    // Hide all targets, then show matching
    $('[data-progressive-target="' + target + '"]').addClass("f-hide").removeClass("f-show");

    if (val !== "") {
      if (wildcard === "*" && val !== "") {
        $('[data-progressive-target="' + target + '"]').removeClass("f-hide").addClass("f-show");
      } else {
        $('[data-progressive-target="' + target + '"][data-progressive-input-value="' + val + '"]')
          .removeClass("f-hide")
          .addClass("f-show");
      }
    }

    // Chain: trigger nested progressive inputs
    const nested = $('[data-progressive-target="' + target + '"]')
      .find("[data-progressive-input]")
      .data("progressive-input");
    if (nested && $('[data-progressive-target="' + nested + '"]').find(":input").val() !== "") {
      $('[data-progressive-target="' + nested + '"]').find(":input").trigger("input");
    }

    // Hide nested that are not visible
    $("[data-progressive-input]:not(:visible)").each(function () {
      const n = $(this).data("progressive-input");
      $('[data-progressive-target="' + n + '"]').removeClass("f-show").addClass("f-hide");
    });
  });

  /* ───── Go-to attribute links ───── */
  if (formWrapper.data("debug-mode")) {
    $("[data-go-to]").each(function () {
      $(this).append("<br>Data Go To = ", $(this).data("go-to"));
    });
    $("[data-answer]").each(function () {
      $(this).append("<br>Data Answer = ", $(this).data("answer"));
    });
  }

  /* ============================================================
   *  INITIALIZATION
   * ============================================================ */
  updateStep();
  triggerInputAllData();
  cloneRemove();
  cloneRemoveInput();

  console.log("[Multistep] Initialized — " + steps.length + " steps, customError: " + customError + ", logicExtra: " + logicExtra);

})();
