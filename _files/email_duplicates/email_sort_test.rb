require 'minitest/autorun'
require_relative 'email_sort'

class EmailsortTest < Minitest::Test

  def test_email_list_setup
    num_emails = 100_000
    list = generate_email_list(num_emails)
    assert_equal list.count/2, list.uniq.count
    assert_equal list.count, num_emails
  end

  def test_uniquify
    list = generate_email_list(100_000)
    assert_equal list.uniq, uniquify(list)
  end

end
