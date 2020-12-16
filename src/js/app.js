App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load houses.
    $.getJSON('../houses.json', function(data) {
      var housesRow = $('#housesRow');
      var houseTemplate = $('#houseTemplate');

      for (i = 0; i < data.length; i ++) {
        houseTemplate.find('.panel-title').text(data[i].name);
        houseTemplate.find('img').attr('src', data[i].picture);
        houseTemplate.find('.house-type').text(data[i].type);
        houseTemplate.find('.house-years').text(data[i].years);
        houseTemplate.find('.house-location').text(data[i].location);
        houseTemplate.find('.btn-buy').attr('data-id', data[i].id);

        housesRow.append(houseTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    
    // Modern dapp browsers...
    if (window.ethereum)
    {
      App.web3Provider = window.ethereum;
      try
      {
        // Request acoount access
        await window.ethereum.enable();
      } catch(error)
      {
        //User denied account access...
        console.error("User denied account access")
      }
    }
    //Legacy dapp browsers...
    else if (window.web3)
    {
      App.web3Provider = window.web3.currentProvider;
    }
    //If no injected web3 instanced is detected, fall back to Ganache
    else
    {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);


    return App.initContract();
  },

  initContract: function() {
    
    $.getJSON('Sales.json', function(data)
    {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var SalesArtifact = data;
      App.contracts.Sales = TruffleContract(SalesArtifact);

      // Set the provider for our contract
      App.contracts.Sales.setProvider(App.web3Provider);

      //Use our contract to retrieve and mark the bought houses
      return App.markBought();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-buy', App.handleBuy);
  },

  markBought: function() {
    var salesInstance;

    App.contracts.Sales.deployed().then(function(instance)
    {
      salesInstance = instance;

      return salesInstance.getBuyers.call();
    }).then(function(buyers)
    {
      for (i = 0; i < buyers.length; i++)
      {
        if (buyers[i] !== '0x0000000000000000000000000000000000000000')
        {
          $('.panel-house').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err)
    {
      console.log(err.message);
    });
  },

  handleBuy: function(event) {
    event.preventDefault();

    var houseId = parseInt($(event.target).data('id'));

    var salesInstance;

    web3.eth.getAccounts(function(error, accounts)
    {
      if(error)
      {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Sales.deployed().then(function(instance)
      {
        salesInstance = instance;

        // Execute buy as a transaction by sending account
        return salesInstance.buy(houseId, {from: account});
        
      }).then(function(result)
      {
        return App.markBought();
      }).catch(function(err)
      {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
