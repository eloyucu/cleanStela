jQuery('document').ready(function()
{
	jQuery('#Admin').on('click', function()
	{
		jQuery('#alert-admin').removeClass('hide');
	});
	jQuery('#alert-admin').on('click', function()
	{
		jQuery(this).addClass('hide');
	});
});
