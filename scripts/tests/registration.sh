# Register 50 dummy accounts
# Ensure the $NODE_IP and $TEST_REGISTER_ACCOUNT_NUM environment variables are set
# before running this test, otherwise TEST_REGISTER_ACCOUNT_NUM is set to 1000
num_accounts=${TEST_REGISTER_ACCOUNT_NUM:-1000}
node_ip=${NODE_IP}

for i in `seq 1 $num_accounts`; do
    curl -X POST -H "Content-Type: application/json" http://$node_ip/account/register/ -d '{"ssusn_email":"'$i'@1.com", "ssusn_fname":"1", "ssusn_lname":"1", "ssusn_password":"1"}'
    curl -X DELETE http://$node_ip/account/ -d '{"ssusn_email":"'$i'@1.com"}'
done;
