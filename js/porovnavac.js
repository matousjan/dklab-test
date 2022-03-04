var dkLabProductComparer = new function () {
    this.dkLabkeyHash = "dkLabCompareProductsHash";
    this.dkLabCompareProductsLS = "dkLabCompareProducts";

    this.run = function () {

        this.showComparerDkLabComparer();

        document.addEventListener("ShoptetDOMPageContentLoaded", () => { this.showComparerDkLabComparer() });

        document.addEventListener("ShoptetDOMPageMoreProductsLoaded", () => { this.showComparerDkLabComparer() });
    }

    this.showComparerDkLabComparer = function () {
        let shoptetData = dataLayer[0].shoptet;

        //DETAIL
        if (shoptetData.pageType === "productDetail") {
            /*zkontroluju objekt, vlozim styl a zobrazim prvky pro pridani/mazani*/
            if (shoptetData.hasOwnProperty("product")) {
                this.getProductsFromStorageDkLabComparer(this.showDetailControlsDkLabComparer);
                this.getProductsFromStorageDkLabComparer(this.showCategoryControlsDkLabComparer);
            }
        } else if (shoptetData.pageType === "category" || shoptetData.pageType === "homepage" || shoptetData.pageType === "article") {
            /*vlozim styl a zobrazim prvky pro pridani/mazani*/
            this.getProductsFromStorageDkLabComparer(this.showCategoryControlsDkLabComparer);
        } else {
            this.getProductsFromStorageDkLabComparer(this.showNumberOfComparedItems);
        }
    }

    this.showDetailControlsDkLabComparer = function (storedProducts) {
        let linkType = dkLabPorovnavacZboziDataLayer.options.linkTypeDetail;
        let guid = dataLayer[0].shoptet.product.guid;

        $(".dkLabComparerDetailSpan").remove();
        $(".dkLabComparerFlagDetail").remove();

        let dkLabComparerDiv;
        if ($("#dkLabComparerDiv:first").length > 0) {
            dkLabComparerDiv = $("#dkLabComparerDiv:first");
        } else {
            dkLabComparerDiv = "<div class=\"dkLabComparerDiv\" id=\"dkLabComparerDiv\"></div>";

            let favourite = $(dkLabPorovnavacZboziDataLayer.template.favouriteProductsDetailDiv);
            let addIdeal = $(dkLabComparerTemplate.selectors.detailAddLinkDivAfter);
            let addDefault = $(dkLabComparerTemplate.selectors.detailAddLinkDivAfterDefault);

            if (favourite.length == 1) {
                $(favourite).after(dkLabComparerDiv);
            } else if (addIdeal.length == 1) {
                $(addIdeal).after(dkLabComparerDiv);
            } else if (addDefault.length == 1) {
                $(addDefault).after(dkLabComparerDiv);
            }
        }

        if (dkLabProductComparer.isNotComparerAllowed()) {
            let span = dkLabProductComparer.generateLink("dkLabComparerNotAllowed dkLabComparerDetailSpan show-tooltip", "dkLabComparerDetailSpan", dkLabComparerOpt.link.linkAddText, dkLabComparerOpt.onlyRegisteredDesc, linkType);
            $("#dkLabComparerDiv").append(span);
            return;
        }

        if (dkLabProductComparer.isProductInStorage(storedProducts, guid)) {

            let span = dkLabProductComparer.generateLink("dkLabComparerRemoveProduct dkLabComparerDetailSpan", "dkLabComparerDetailSpan", dkLabComparerOpt.link.linkRemoveText, null, linkType);
            if (span != null) {
                $("#dkLabComparerDiv").append(span);
                $("#dkLabComparerDetailSpan").click(function () { dkLabProductComparer.removeProductFromStorageDkLabComparer(guid, dkLabProductComparer.showDetailControlsDkLabComparer); });
            }

            dkLabProductComparer.addDetailFlagsDivIfNeeded();

            let detailFlagClass = dkLabComparerTemplate.detailFlagClass + " dkLabComparerFlagDetail";
            let flag = dkLabProductComparer.generateFlag(detailFlagClass);
            if (flag != null) {
                $(dkLabComparerTemplate.selectors.detailInfoFlags).append(flag);
            }
        } else {
            dkLabProductComparer.removeDetailFlagsDivIfEmpty();

            let span = dkLabProductComparer.generateLink("dkLabComparerAddProduct dkLabComparerDetailSpan", "dkLabComparerDetailSpan", dkLabComparerOpt.link.linkAddText, null, linkType);
            if (span != null) {
                $("#dkLabComparerDiv").append(span);
                $("#dkLabComparerDetailSpan").click(function () { dkLabProductComparer.addProductToStorageDkLabComparer(guid, dkLabProductComparer.showDetailControlsDkLabComparer); });
            }
        }
        dkLabProductComparer.showNumberOfComparedItems(storedProducts);
    }

    this.showCategoryControlsDkLabComparer = function (storedProducts) {
        $(".dkLabComparerProductSpan").remove();

        let linkType = dkLabPorovnavacZboziDataLayer.options.linkType;
        let productsOnPage = $('[' + dkLabComparerTemplate.selectors.guidAttribute + ']');
        let userLogged = dkLabProductComparer.isUserLogged();

        productsOnPage.each(function () {
            let guid = $(this).attr(dkLabComparerTemplate.selectors.guidAttribute);

            let dkLabComparerDiv = $(this).find(".dkLabComparerProductDiv");

            if (dkLabComparerDiv.length == 0) {
                dkLabComparerDiv = "<div class=\"dkLabComparerProductDiv\"></div>";

                let addDivWrapper = $(this).find(dkLabComparerTemplate.selectors.categoryAddLinkWrapper);
                if (dkLabComparerTemplate.categoryAddLinkAction == 'after') {
                    addDivWrapper.after(dkLabComparerDiv);
                } else if (dkLabComparerTemplate.categoryAddLinkAction == 'append') {
                    addDivWrapper.append(dkLabComparerDiv);

                } else if (dkLabComparerTemplate.categoryAddLinkAction == 'prepend') {
                    addDivWrapper.prepend(dkLabComparerDiv);
                }

                dkLabComparerDiv = $(this).find(".dkLabComparerProductDiv");
            } else {
                dkLabComparerDiv.removeClass('onlyIcon');
            }

            if (linkType != null && linkType == 'I') {
                dkLabComparerDiv.addClass('onlyIcon');
            }


            if (dkLabProductComparer.isNotComparerAllowed()) {
                let span = dkLabProductComparer.generateLink("dkLabComparerNotAllowed dkLabComparerProductSpan show-tooltip", null, dkLabComparerOpt.link.linkAddText, dkLabComparerOpt.onlyRegisteredDesc, linkType);
                $(this).find(".dkLabComparerProductDiv").append(span);
            } else {
                if (dkLabProductComparer.isProductInStorage(storedProducts, guid)) {

                    let span = dkLabProductComparer.generateLink("dkLabComparerRemoveProduct dkLabComparerProductSpan", null, dkLabComparerOpt.link.linkRemoveText, null, linkType);
                    if (span != null) {
                        $(this).find(".dkLabComparerProductDiv").append(span);
                        $(this).find(".dkLabComparerProductSpan").click(function () { dkLabProductComparer.removeProductFromStorageDkLabComparer(guid, dkLabProductComparer.showCategoryControlsDkLabComparer); });
                    }

                    //FLAGS
                    //check if flags div exists                    
                    let flags = $(this).find(dkLabComparerTemplate.selectors.flags);

                    if (flags.length === 0) {

                        let flagsWrapper = $(this).find(dkLabComparerTemplate.selectors.categoryFlagDivWrapper);

                        if (dkLabComparerTemplate.selectors.categoryFlagDivAdd == 'append') {
                            flagsWrapper.append(dkLabComparerTemplate.categoryFlagsDiv);
                        } else if (dkLabComparerTemplate.selectors.categoryFlagDivAdd == 'after') {
                            flagsWrapper.after(dkLabComparerTemplate.categoryFlagsDiv);
                        }
                        flags = $(this).find(dkLabComparerTemplate.selectors.flags);
                    }

                    let comparerFlag = $(this).find(".dkLabComparerFlagProduct");
                    if (comparerFlag.length === 0) {
                        let categoryFlagClass = dkLabComparerTemplate.categoryFlagClass + " dkLabComparerFlagProduct";
                        let flag = dkLabProductComparer.generateFlag(categoryFlagClass);
                        if (flag != null) {
                            flags.append(flag);
                        }
                    }

                } else {

                    $(this).find(".dkLabComparerFlagProduct").remove();

                    dkLabProductComparer.removeCategoryFlagsDivIfEmpty($(this));

                    let span = dkLabProductComparer.generateLink("dkLabComparerAddProduct dkLabComparerProductSpan", null, dkLabComparerOpt.link.linkAddText, null, linkType);
                    if (span != null) {
                        $(this).find(".dkLabComparerProductDiv").append(span);
                        $(this).find(".dkLabComparerProductSpan").click(function () { dkLabProductComparer.addProductToStorageDkLabComparer(guid, dkLabProductComparer.showCategoryControlsDkLabComparer); });
                    }
                }
            }
        });
        dkLabProductComparer.showNumberOfComparedItems(storedProducts);
    }

    //Zobrazit pocet porovnavanych produktu v ikone hlavicky
    this.showNumberOfComparedItems = function (products) {
        let isNotAllowed = dkLabProductComparer.isNotComparerAllowed();
        let spanClasses = 'class = "dkLabComparerHeaderIconBtn ' + (isNotAllowed ? 'dkLabComparerNotAllowed show-tooltip' : '') + '"' + (isNotAllowed ? ' title="' + dkLabComparerOpt.onlyRegisteredDesc + '"' : '');

        $("#dkLabComparerHeaderIconBtn").remove();
        //TODO nebo overeni ze existuje
        $("#dkLabComparerHeaderWrappper").remove();

        let dkLabComparerBtn = $("<span " + spanClasses + " id=\"dkLabComparerHeaderIconBtn\"></span>");

        if (products !== null) {
            if (products.length > 0) {
                dkLabComparerBtn.append("<em>" + products.length + "</em>");
            }
        }

        let dkLabComparerHeaderWrapper = $(dkLabComparerTemplate.headerIconWrapper);
        dkLabComparerHeaderWrapper.attr('id', 'dkLabComparerHeaderWrappper');
        dkLabComparerHeaderWrapper.append(dkLabComparerBtn);

        $(dkLabComparerTemplate.selectors.headerIconAddBefore).before(dkLabComparerHeaderWrapper);

        if (isNotAllowed) {
            return;
        }

        $(dkLabComparerBtn).on("click", function () {
            dkLabProductComparer.showComparedProducts(products);
        });
    }

    //DATA, GUIDS PART
    this.isUserLogged = function () {
        if (dataLayer[0].shoptet.customer.registered === true) {
            if (shoptet.customer.guid.length > 0) {
                return true;
            }
        }
        return false;
    }

    this.isProductInStorage = function (products, productGuid) {
        if (products.length > 0) {
            if (products.includes(productGuid)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Remove value from array
     * @param {array} arr 
     * @param {*} value 
     * @returns array withnout value
     */
    this.arrayRemove = function (arr, value) {
        return arr.filter(function (ele) {
            return ele != value;
        });
    }

    this.isNotComparerAllowed = function () {
        if (dkLabPorovnavacZboziDataLayer.options.onlyRegistered == 1 && !dkLabProductComparer.isUserLogged()) {
            return true;
        } else {
            return false;
        }
    }

    //Get product
    this.getProductsFromStorageDkLabComparer = function (showControlsCallback) {
        if (this.isUserLogged()) {
            this.getProductsFromDatabase(showControlsCallback);
        } else {
            this.getProductsFromLocalStorageDkLabComparer(showControlsCallback);
        }
    }

    this.getProductsFromLocalStorageDkLabComparer = function (showControlsCallback) {
        let products = new Array();
        if (localStorage.getItem(this.dkLabCompareProductsLS) !== null) {
            products = JSON.parse(localStorage.getItem(this.dkLabCompareProductsLS));
        } else {
            localStorage.setItem(this.dkLabCompareProductsLS, JSON.stringify(new Array()));
        }
        if (showControlsCallback != null) {
            showControlsCallback(products);
        } else {
            return products;
        }
    }

    this.getProductsFromDatabase = function (showControlsCallback) {
        //TODO pouze pro test
        let eshopID = dataLayer[0].shoptet.projectId;
        let customerGuid = shoptet.customer.guid;
        var products = new Array();
        let url = dkLabPorovnavacZboziDataLayer.urls.getCustomerProduct;
        $.post(url, { eshopID: eshopID, customerGuid: customerGuid, config: dkLabPorovnavacZboziDataLayer.configName })
            .done(function (responseJSON) {
                let response = JSON.parse(responseJSON);
                if (response.status == "success") {
                    products = response.products.slice();
                } else if (response.status == "error") {
                    console.error(response.message);
                }
            })
            .fail(function (xhr, textStatus, errorThrown) {
                console.error('dkLAB Comparer ' + xhr.responseText);
            })
            .always(function () {
                showControlsCallback(products);
            });
        return products;
    }

    //Add products
    this.addProductToStorageDkLabComparer = function (productGuid, showControlsCallback) {
        if (this.isUserLogged()) {
            this.addProductToDatabaseDkLabComparer(productGuid, showControlsCallback);
        } else {
            this.addProductToLocalStorageDkLabComparer(productGuid, showControlsCallback);
        }
    }

    this.addProductToLocalStorageDkLabComparer = function (productGuid, showControlsCallback) {
        let products = this.getProductsFromLocalStorageDkLabComparer(null);
        if (products.length < dkLabPorovnavacZboziDataLayer.options.maxComparedProducts) {
            products.push(productGuid);
            localStorage.setItem(this.dkLabCompareProductsLS, JSON.stringify(products));
            showControlsCallback(products);
        } else {
            dkLabProductComparer.maxProductsExceeded();
        }

    }

    this.addProductToDatabaseDkLabComparer = function (productGuid, showControlsCallback) {
        dkLabProductComparer.dkLabShowSpinner();
        let url = dkLabPorovnavacZboziDataLayer.urls.manageCustomerProduct;
        let eshopID = dataLayer[0].shoptet.projectId;
        let customerGuid = shoptet.customer.guid;
        let action = "add";
        let products = new Array();
        $.post(url, { eshopID: eshopID, customerGuid: customerGuid, productGuid: productGuid, action: action, config: dkLabPorovnavacZboziDataLayer.configName })
            .done(function (responseJSON) {
                response = JSON.parse(responseJSON);
                if (response.status == "success") {
                    products = response.products.slice();
                    showControlsCallback(products);
                } else if (response.status == "error") {
                    console.error(response.message);
                } else if (response.status == "maxProductsExceeded") {
                    dkLabProductComparer.maxProductsExceeded();
                }
            })
            .fail(function (xhr, textStatus, errorThrown) {
                console.error('dkLAB Comparer ' + xhr.responseText);
            })
            .always(function () {
                dkLabProductComparer.dkLabHideSpinner();
            });
    }

    //Remove products
    this.removeProductFromStorageDkLabComparer = function (productGuid, showControlsCallback) {
        if (this.isUserLogged()) {
            this.removeProductFromDatabaseDkLabComparer(productGuid, showControlsCallback)
        } else {
            this.removeProductFromLocalStorageDkLabComparer(productGuid, showControlsCallback);
        }
    }

    this.removeProductFromLocalStorageDkLabComparer = function (productGuid, showControlsCallback) {
        let products = this.getProductsFromLocalStorageDkLabComparer(null);
        let newProducts = this.arrayRemove(products, productGuid);
        localStorage.setItem(this.dkLabCompareProductsLS, JSON.stringify(newProducts));
        showControlsCallback(newProducts);
    }

    this.removeProductFromDatabaseDkLabComparer = function (productGuid, showControlsCallback) {
        dkLabProductComparer.dkLabShowSpinner();
        let url = dkLabPorovnavacZboziDataLayer.urls.manageCustomerProduct;
        let eshopID = dataLayer[0].shoptet.projectId;
        let customerGuid = shoptet.customer.guid;
        let products = new Array();
        $.post(url, { eshopID: eshopID, customerGuid: customerGuid, productGuid: productGuid, action: 'remove', config: dkLabPorovnavacZboziDataLayer.configName })
            .done(function (responseJSON) {
                response = JSON.parse(responseJSON);
                if (response.status == "success") {
                    products = response.products.slice();
                } else if (response.status == "error") {
                    console.error(response.message);
                }
            })
            .fail(function (xhr, textStatus, errorThrown) {
                console.error('dkLAB Comparer ' + xhr.responseText);
            })
            .always(function () {
                dkLabProductComparer.dkLabHideSpinner();
                showControlsCallback(products);
            });
    }

    /**
     * Remove products from storage. No callback
     * @param {array} guidsArray 
     */
    this.removeProductsFromStorage = function (guidsArray) {
        guidsArray.forEach(element => dkLabProductComparer.removeProductFromStorageDkLabComparer(element, () => function ($products) { return; }));
    }

    //GRAPHIC PART
    this.dkLabShowSpinner = function (parentDOM) {
        showSpinner();
    }

    this.dkLabHideSpinner = function (parentDOM) {
        hideSpinner();
    }

    this.addDetailFlagsDivIfNeeded = function () {
        if ($(dkLabComparerTemplate.selectors.detailInfoFlags).length === 0) {

            let action = dkLabComparerTemplate.selectors.detailFlagDivAdd;
            let wrapper = dkLabComparerTemplate.selectors.detailFlagDivWrapper;

            if (action == 'prepend') {
                $(wrapper).prepend($(dkLabComparerTemplate.detailFlagsDiv));
            } else if (action == 'after') {
                $(wrapper).after($(dkLabComparerTemplate.detailFlagsDiv));
            }
        }
    }

    this.removeDetailFlagsDivIfEmpty = function () {
        if ($(dkLabComparerTemplate.selectors.detailInfoFlagsFlag).length === 0) {
            $(dkLabComparerTemplate.selectors.detailInfoFlags).remove();
        }
    }

    this.removeCategoryFlagsDivIfEmpty = function (product) {
        let flagsExists = product.find(dkLabComparerTemplate.selectors.flags);
        if (flagsExists.children().length === 0) {
            product.find(dkLabComparerTemplate.selectors.flags).remove();
        }
    }

    this.generateFlag = function (flagClass) {
        let tagType = dkLabPorovnavacZboziDataLayer.options.tagType;

        let flag = null;
        let hasIcon = 'hasIcon';
        if (tagType == "T") {
            flag = "<span class=\"" + flagClass + "\"><span>" + dkLabComparerOpt.tag.tagText + "</span></span>";
        } else if (tagType == "I") {
            flag = "<span class=\"" + flagClass + " " + hasIcon + "\"><span></span></span>";
        } else if (tagType == "IT") {
            flag = "<span class=\"" + flagClass + " " + hasIcon + "\"><span>" + dkLabComparerOpt.tag.tagText + "</span></span>";
        }
        return flag;
    }

    this.generateLink = function (linkClass, linkId, linkText, linkTitle, linkType) {
        let link = null;

        let id = linkId == null ? "" : " id=\"" + linkId + "\"";


        let title = linkTitle != null && linkTitle.length > 0 ? " title=\"" + linkTitle + "\"" : "";
        let hasIcon = 'hasIcon';

        if (linkType == "T") {
            link = "<span class=\"" + linkClass + "\" " + title + id + ">" + linkText + "</span>";
        } else if (linkType == "I") {
            link = "<span class=\"" + linkClass + " " + hasIcon + "\" " + title + id + "></span>";
        } else if (linkType == "IT") {
            link = "<span class=\"" + linkClass + " " + hasIcon + "\" " + title + id + ">" + linkText + "</span>";
        }
        return link;
    }

    this.maxProductsExceeded = function () {
        showMessage(dkLabComparerOpt.maxProductsExceeded, "error", "", false, false);
    }


    //COLOR BOX
    /**
     * Create colorbox windw
     * @param {*} comparerHtml 
     * @param {bool} showDelGuidsInfo Show info about deleting guids
     */
    this.showColorBox = function (comparerHtml) {
        let cboxWidth = Math.round(window.innerWidth * 0.95);
        let cboxHeigth = Math.round(window.innerHeigth * 0.95);
        $.colorbox({
            html: comparerHtml
            , width: cboxWidth
            , heigth: cboxHeigth
            , className: "colorbox-lg"
            , onComplete: function () {
                $.colorbox.resize();

                //ADD class to colorbox 
                $('#colorbox').removeClass('dkLabComparerColorbox');
                $('#colorbox').addClass('dkLabComparerColorbox');
                $('html').removeClass('dklabComparerWindow');
                $('html').addClass('dklabComparerWindow');

                $('#dkLabComparerDeletedProductsDiv').delay(5000).slideUp(1000);

                dkLabProductComparer.removeButtonsActions();
            }
            , onCleanup: function () {
                $('#colorbox').removeClass('dkLabComparerColorbox');
                $('html').removeClass('dklabComparerWindow');
                dkLabProductComparer.showComparerDkLabComparer();
            }
        });
    }


    /**
     * Get products from db Cache and show colorbox
     * @param {} products 
     */
    this.showComparedProducts = function (products) {
        dkLabProductComparer.dkLabShowSpinner();
        let p_eshopID = dataLayer[0].shoptet.projectId;
        let p_currency = dataLayer[0].shoptet.currency;
        let p_language = dkLabComparerShopLanguage;
        let p_userLogged = dkLabProductComparer.isUserLogged() ? 1 : 0;

        let postObject = { eshopID: p_eshopID, currency: p_currency, guids: products, language: p_language, config: dkLabPorovnavacZboziDataLayer.configName, isUserLogged: p_userLogged };
        let postObjectJSON = JSON.stringify(postObject);

        $.post(dkLabPorovnavacZboziDataLayer.urls.getComparerData, postObjectJSON)
            .done(function (responseJSON) {
                let response = JSON.parse(responseJSON);
                if (response.status == 'success') {
                    let deletedGuids = response.deletedGuids;
                    let myhtml = response.html;

                    dkLabProductComparer.showColorBox(myhtml);

                    if (deletedGuids.length > 0) {
                        dkLabProductComparer.removeProductsFromStorage(deletedGuids);
                    }
                } else {
                    console.error(response.message);
                }
            })
            .fail(function (xhr, textStatus, errorThrown) {
                console.error('dkLAB Comparer ' + xhr.responseText);
            })
            .always(function () {
                dkLabProductComparer.dkLabHideSpinner();
            });
    }

    this.buyButton = function (code) {
        shoptet.cartShared.addToCart({ productCode: code });
    }

    this.removeButtonsActions = function () {
        let removeButtons = $('[data-dklab-comp-product-guid]');

        removeButtons.each(function () {
            let guid = $(this).attr('data-dklab-comp-product-guid');
            //call remove guid
            $(this).click(() => dkLabProductComparer.btnRemoveProductFromComparer(guid));
        });
    }

    this.btnRemoveProductFromComparer = function (guid) {
        dkLabProductComparer.removeProductFromStorageDkLabComparer(guid, dkLabProductComparer.showComparedProducts);
    }

}
var dkLabComparerTemplate;
var dkLabComparerOpt;
let dkLabComparerShopLanguage;

$(document).ready(function () {
    let dkLabComparerTemplateName = (shoptet.design.template.name).toLowerCase();

    dkLabComparerShopLanguage = $('html').attr('lang');
    if (dkLabPorovnavacZboziDataLayer.options.hasOwnProperty(dkLabComparerShopLanguage)) {
        dkLabComparerOpt = dkLabPorovnavacZboziDataLayer.options["" + dkLabComparerShopLanguage + ""];
        //Check for current language show comparer on web
        if (dkLabComparerOpt.showComparer == 1) {
            if (dkLabPorovnavacZboziDataLayer.template.hasOwnProperty(dkLabComparerTemplateName)) {
                dkLabComparerTemplate = dkLabPorovnavacZboziDataLayer.template["" + dkLabComparerTemplateName + ""];
                dkLabProductComparer.run();
            } else {
                console.error("Plugin does not support e-shop template (" + dkLabComparerTemplateName + ")");
            }
        }
    } else {
        dkLabComparerOpt = dkLabPorovnavacZboziDataLayer.options["" + dkLabPorovnavacZboziDataLayer.options.defaultLanguage + ""];
    }
});