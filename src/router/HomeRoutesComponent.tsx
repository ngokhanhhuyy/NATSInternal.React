import React, { useState, useEffect, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePageLoadProgressBarStore } from "@/stores/pageLoadProgressBarStore";
import { useAlertModalStore, type IAlertModalStore } from "@/stores/alertModalStore";
import { useBreadcrumbStore } from "@/stores/breadcrumbStore";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useRouteGenerator } from "@/router/routeGenerator";

// Loading view.
import LoadingView from "@/views/layouts/LoadingView";

// View components.
const HomeView = React.lazy(() => import("@/views/home/HomeView"));

// User views.
const UserListView = React.lazy(() => import("@/views/user/userList/UserListView"));
const UserProfileView = React.lazy(() => import("@/views/user/userProfile/UserProfileView"));
const UserCreateView = React.lazy(() => import("@/views/user/userUpsert/userCreate/UserCreateView"));
const UserUpdateView = React.lazy(() => import("@/views/user/userUpsert/userUpdate/UserUpdateView"));
const UserPasswordChangeView = React.lazy(() => import("@/views/user/userPasswordChange/UserPasswordChangeView"));
const UserPasswordResetView = React.lazy(() => import("@/views/user/userPasswordReset/UserPasswordResetView"));

// Customer views.
const CustomerListView = React.lazy(() => import("@/views/customer/customerList/CustomerListView"));
const CustomerDetailView = React.lazy(() => import("@/views/customer/customerDetail/CustomerDetailView"));
const CustomerUpsertView = React.lazy(() => import("@/views/customer/customerUpsert/CustomerUpsertView"));

// Product views.
const ProductListView = React.lazy(() => import("@/views/product/productList/ProductListView"));
const ProductDetailView = React.lazy(() => import("@/views/product/productDetail/ProductDetailView"));
const ProductUpsertView = React.lazy(() => import("@/views/product/productUpsert/ProductUpsertView"));
const BrandUpsertView = React.lazy(() => import("@/views/product/brandUpsert/BrandUpsertView"));
const ProductCategoryUpsertView = React.lazy(() => import("@/views/product/productCategoryUpsert/ProductCategoryUpsertView"));

// Consultant views.
const ConsultantListView = React.lazy(() => import("@/views/consultant/consultantList/ConsultantListView"));
const ConsultantDetailView = React.lazy(() => import("@/views/consultant/consultantDetail/ConsultantDetailView"));
const ConsultantUpsertView = React.lazy(() => import("@/views/consultant/consultantUpsert/ConsultantUpsertView"));

// Supply views.
const SupplyListView = React.lazy(() => import("@/views/supply/supplyList/SupplyListView"));
const SupplyDetailView = React.lazy(() => import("@/views/supply/supplyDetail/SupplyDetailView"));
const SupplyUpsertView = React.lazy(() => import("@/views/supply/supplyUpsert/SupplyUpsertView"));

// Expense views.
const ExpenseListView = React.lazy(() => import("@/views/expense/expenseList/ExpenseListView"));
const ExpenseDetailView = React.lazy(() => import("@/views/expense/expenseDetail/ExpenseDetailView"));
const ExpenseUpsertView = React.lazy(() => import("@/views/expense/expenseUpsert/ExpenseUpsertView"));

// Order views.
const OrderListView = React.lazy(() => import("@/views/order/orderList/OrderListView"));
const OrderDetailView = React.lazy(() => import("@/views/order/orderDetail/OrderDetailView"));
const OrderUpsertView = React.lazy(() => import("@/views/order/orderUpsert/OrderUpsertView"));

// Treatment views.
const TreatmentListView = React.lazy(() => import("@/views/treatment/treatmentList/TreatmentListView"));
const TreatmentDetailView = React.lazy(() => import("@/views/treatment/treatmentDetail/treatmentDetailView"));
const TreatmentUpsertView = React.lazy(() => import("@/views/treatment/treatmentUpsert/TreatmentUpsertView"));

// Debt views.
const DebtOverviewView = React.lazy(() => import("@/views/debt/overview/DebtOverviewView"));
const DebtIncurrenceListView = React.lazy(() => import("@/views/debt/list/DebtIncurrenceListView"));
const DebtIncurrenceDetailView = React.lazy(() => import("@/views/debt/detail/DebtIncurrenceDetailView"));
const DebtIncurrenceUpsertView = React.lazy(() => import("@/views/debt/upsert/DebtIncurrenceUpsertView"));
const DebtPaymentListView = React.lazy(() => import("@/views/debt/list/DebtPaymentListView"));
const DebtPaymentDetailView = React.lazy(() => import("@/views/debt/detail/DebtPaymentDetailView"));
const DebtPaymentUpsertView = React.lazy(() => import("@/views/debt/upsert/DebtPaymentUpsertView"));

// Report.
const ReportView = React.lazy(() => import("@/views/report/monthlyReport/MonthlyReportView"));

// Services dependencies.
const routeGenerator = useRouteGenerator();

type ElementGetterParameters = {
    params: Params,
    alertModalStore: IAlertModalStore,
    initialData: ResponseDtos.InitialData,
};

type ElementGetter = (parameter: ElementGetterParameters) => Promise<React.ReactNode | null>;

interface Route {
    path: RegExp;
    element: ElementGetter;
    meta: RouteMeta;
}

export interface BreadcrumbItem {
    text: string;
    to?: string;
}

export interface RouteMeta {
    pageTitle?: string;
    breadcrumbItems?: BreadcrumbItem[] | ((params: Params) => BreadcrumbItem[]);
}

interface Routes {
    [routeName: string]: Route;
}

interface Params {
    [key: string]: string;
}

const routes: Routes = {
    home: {
        path: /^\/$/,
        element: async () => <HomeView />,
        meta: {
            pageTitle: "Trang chủ",
            breadcrumbItems: []
        },
    },
    userList: {
        path: /^\/users\/?$/,
        element: async () => <UserListView />,
        meta: {
            pageTitle: "Danh sách nhân viên",
            breadcrumbItems: [
                { text: "Danh sách nhân viên" },
            ]
        },
    },
    userProfile: {
        path: /^\/users\/(?<id>\d+)\/?$/,
        element: async ({ params }) => (
            <UserProfileView id={parseInt(params.id)} />
        ),
        meta: {
            pageTitle: "Hồ sơ nhân viên",
            breadcrumbItems: [
                { text: "Danh sách nhân viên", to: "/users" },
                { text: "Hồ sơ nhân viên" },
            ]
        },
    },
    userCreate: {
        path: /^\/users\/create\/?$/,
        element: async () => <UserCreateView />,
        meta: {
            pageTitle: "Tạo nhân viên mới",
            breadcrumbItems: [
                { text: "Danh sách nhân viên", to: routeGenerator.getUserListRoutePath() },
                { text: "Hồ sơ nhân viên" },
            ]
        },
    },
    userUpdate: {
        path: /^\/users\/(?<id>\d+)\/update\/?$/,
        element: async ({ params }) => (
            <UserUpdateView id={parseInt(params.id as string)} />
        ),
        meta: {
            pageTitle: "Chỉnh sửa nhân viên",
            breadcrumbItems: [
                { text: "Danh sách nhân viên", to: "/users" },
                { text: "Chỉnh sửa nhân viên" },
            ]
        },
    },
    userPasswordChange: {
        path: /^\/users\/changePassword\/?$/,
        element: async () => <UserPasswordChangeView />,
        meta: {
            pageTitle: "Đổi mật khẩu",
            breadcrumbItems: [
                { text: "Nhân viên", to: "/users" },
                { text: "Đổi mật khẩu" },
            ]
        }
    },
    userPasswordReset: {
        path: /^\/users\/(?<id>\d+)\/resetPassword\/?$/,
        element: async ({ params }) => (
            <UserPasswordResetView id={parseInt(params.id)} />
        ),
        meta: {
            pageTitle: "Đặt lại mật khẩu",
            breadcrumbItems: [
                { text: "Danh sách nhân viên", to: "/users" },
                { text: "Đặt lại mật khẩu" },
            ]
        },
    },
    customerList: {
        path: /^\/customers\/?$/,
        element: async () => <CustomerListView />,
        meta: {
            pageTitle: "Danh sách khách hàng",
            breadcrumbItems: [
                { text: "Khách hàng" },
            ],
        }
    },
    customerDetail: {
        path: /^\/customers\/(?<id>\d+)\/?$/,
        element: async ({ params }) => (
            <CustomerDetailView id={parseInt(params.id)} />
        ),
        meta: {
            pageTitle: "Hồ sơ khách hàng",
            breadcrumbItems: [
                {
                    text: "Danh sách khách hàng",
                    to: routeGenerator.getCustomerListRoutePath()
                },
                { text: "Hồ sơ khách hàng" }
            ]
        }
    },
    customerCreate: {
        path: /^\/customers\/create\/?$/,
        element: async () => (
            <CustomerUpsertView isForCreating={true} />
        ),
        meta: {
            pageTitle: "Tạo khách hàng mới",
            breadcrumbItems: [
                {
                    text: "Danh sách khách hàng",
                    to: routeGenerator.getCustomerListRoutePath()
                },
                { text: "Tạo khách hàng mới" }
            ]
        }
    },
    customerUpdate: {
        path: /^\/customers\/(?<id>\d+)\/update\/?$/,
        element: async ({ params }) => (
            <CustomerUpsertView
                isForCreating={false}
                id={parseInt(params.id)}
            />
        ),
        meta: {
            pageTitle: "Chỉnh sửa khách hàng",
            breadcrumbItems: [
                {
                    text: "Danh sách khách hàng",
                    to: routeGenerator.getCustomerListRoutePath()
                },
                { text: "Chỉnh sửa khách hàng" }
            ]
        }
    },
    productList: {
        path: /^\/products\/?$/,
        element: async () => <ProductListView />,
        meta: {
            pageTitle: "Danh sách sản phẩm",
            breadcrumbItems: [
                { text: "Danh sách sản phẩm" },
            ]
        }
    },
    productDetail: {
        path: /^\/products\/(?<id>\d+)\/?$/,
        element: async ({ params }) => (
            <ProductDetailView id={parseInt(params.id)} />
        ),
        meta: {
            pageTitle: "Chi tiết sản phẩm",
            breadcrumbItems: [
                { text: "Danh sách sản phẩm", to: routeGenerator.getProductListRoutePath() },
                { text: "Chi tiết sản phẩm" }
            ]
        }
    },
    productCreate: {
        path: /^\/products\/create\/?$/,
        element: async () => <ProductUpsertView />,
        meta: {
            pageTitle: "Tạo sản phẩm mới",
            breadcrumbItems: [
                { text: "Danh sách sản phẩm", to: routeGenerator.getProductListRoutePath() },
                { text: "Tạo sản phẩm mới" }
            ]
        }
    },
    productUpdate: {
        path: /^\/products\/(?<id>\d+)\/update\/?$/,
        element: async ({ params }) => (
            <ProductUpsertView id={parseInt(params.id)} />
        ),
        meta: {
            pageTitle: "Chi tiết sản phẩm",
            breadcrumbItems: [
                { text: "Danh sách sản phẩm", to: routeGenerator.getProductListRoutePath() },
                { text: "Chỉnh sửa sản phẩm" }
            ]
        }
    },
    brandCreate: {
        path: /^\/products\/brands\/create\/?$/,
        element: async () => <BrandUpsertView />,
        meta: {
            pageTitle: "Tạo thương hiệu mới",
            breadcrumbItems: [
                { text: "Danh sách sản phẩm", to: routeGenerator.getProductListRoutePath() },
                { text: "Tạo thương hiệu mới" }
            ]
        }
    },
    brandUpdate: {
        path: /^\/products\/brands\/(?<id>\d+)\/update\/?$/,
        element: async ({ params }) => (
            <BrandUpsertView id={parseInt(params.id)} />
        ),
        meta: {
            pageTitle: "Chỉnh sửa thương hiệu",
            breadcrumbItems: [
                { text: "Danh sách sản phẩm", to: routeGenerator.getProductListRoutePath() },
                { text: "Chỉnh sửa thương hiệu" }
            ]
        }
    },
    productCategoryCreate: {
        path: /^\/products\/categories\/create\/?$/,
        element: async () => <ProductCategoryUpsertView />,
        meta: {
            pageTitle: "Tạo phân loại sản phẩm mới",
            breadcrumbItems: [
                { text: "Danh sách sản phẩm", to: routeGenerator.getProductListRoutePath() },
                { text: "Tạo phân loại mới" }
            ]
        }
    },
    productCategoryUpdate: {
        path: /^\/products\/categories\/(?<id>\d+)\/update\/?$/,
        element: async ({ params }) => (
            <ProductCategoryUpsertView id={parseInt(params.id)} />
        ),
        meta: {
            pageTitle: "Chỉnh sửa phân loại sản phẩm",
            breadcrumbItems: [
                { text: "Danh sách sản phẩm", to: routeGenerator.getProductListRoutePath() },
                { text: "Chỉnh sửa phân loại" }
            ]
        }
    },
    consultantList: {
        path: /^\/consultants\/?$/,
        element: async () => <ConsultantListView />,
        meta: {
            pageTitle: "Danh sách tư vấn",
            breadcrumbItems: [
                { text: "Danh sách tư vấn" },
            ]
        }
    },
    consultantDetail: {
        path: /^\/consultants\/(?<id>\d+)\/?$/,
        element: async ({ params }) => (
            <ConsultantDetailView id={parseInt(params.id)} />
        ),
        meta: {
            pageTitle: "Chi tiết tư vấn",
            breadcrumbItems: [
                { text: "Danh sách tư vấn", to: routeGenerator.getConsultantListRoutePath() },
                { text: "Chi tiết tư vấn" },
            ]
        }
    },
    consultantCreate: {
        path: /^\/consultants\/create\/?$/,
        element: async () => <ConsultantUpsertView />,
        meta: {
            pageTitle: "Tạo tư vấn mới",
            breadcrumbItems: [
                { text: "Danh sách tư vấn", to: routeGenerator.getConsultantListRoutePath() },
                { text: "Tạo tư vấn mới" },
            ]
        }
    },
    consultantUpdate: {
        path: /^\/consultants\/(?<id>\d+)\/update\/?$/,
        element: async ({ params }) => (
            <ConsultantUpsertView id={parseInt(params.id)} />
        ),
        meta: {
            pageTitle: "Chỉnh sửa tư vấn",
            breadcrumbItems: [
                { text: "Danh sách tư vấn", to: routeGenerator.getConsultantListRoutePath() },
                { text: "Chỉnh sửa tư vấn" },
            ]
        }
    },
    supplyList: {
        path: /^\/supplies\/?$/,
        element: async () => <SupplyListView />,
        meta: {
            pageTitle: "Danh sách nhập hàng",
            breadcrumbItems: [
                { text: "Danh sách nhập hàng" },
            ]
        }
    },
    supplyDetail: {
        path: /^\/supplies\/(?<id>\d+)\/?$/,
        element: async ({ params }) => (
            <SupplyDetailView id={parseInt(params.id)} />
        ),
        meta: {
            pageTitle: "Chi tiết đơn nhập hàng",
            breadcrumbItems: [
                {
                    text: "Danh sách đơn nhập hàng",
                    to: routeGenerator.getSupplyListRoutePath()
                },
                { text: "Chi tiết đơn nhập hàng" },
            ]
        }
    },
    supplyCreate: {
        path: /^\/supplies\/create\/?$/,
        element: async () => <SupplyUpsertView />,
        meta: {
            pageTitle: "Tạo đơn nhập hàng mới",
            breadcrumbItems: [
                {
                    text: "Danh sách đơn nhập hàng",
                    to: routeGenerator.getSupplyListRoutePath()
                },
                { text: "Tạo đơn nhập hàng mới" },
            ]
        }
    },
    supplyUpdate: {
        path: /^\/supplies\/(?<id>\d+)\/update\/?$/,
        element: async ({ params }) => (
            <SupplyUpsertView id={parseInt(params.id)} />
        ),
        meta: {
            pageTitle: "Chỉnh sửa đơn nhập hàng",
            breadcrumbItems: [
                {
                    text: "Danh sách đơn nhập hàng",
                    to: routeGenerator.getSupplyListRoutePath()
                },
                { text: "Chỉnh sửa đơn nhập hàng" },
            ]
        }
    },
    expenseList: {
        path: /^\/expenses\/?$/,
        element: async () => <ExpenseListView />,
        meta: {
            pageTitle: "Danh sách chi phí",
            breadcrumbItems: [
                { text: "Danh sách chi phí" },
            ]
        }
    },
    expenseDetail: {
        path: /^\/expenses\/(?<id>\d+)\/?$/,
        element: async ({ params }) => (
            <ExpenseDetailView id={parseInt(params.id)} />
        ),
        meta: {
            pageTitle: "Chi tiết chi phí",
            breadcrumbItems: [
                { text: "Danh sách chi phí", to: routeGenerator.getExpenseListRoutePath()},
                { text: "Chi tiết chi phí" },
            ]
        }
    },
    expenseCreate: {
        path: /^\/expenses\/create\/?$/,
        element: async () => <ExpenseUpsertView />,
        meta: {
            pageTitle: "Tạo chi phí mới",
            breadcrumbItems: [
                {
                    text: "Danh sách đơn nhập hàng",
                    to: routeGenerator.getSupplyListRoutePath()
                },
                { text: "Tạo chi phí mới" },
            ]
        }
    },
    expenseUpdate: {
        path: /^\/expenses\/(?<id>\d+)\/update\/?$/,
        element: async ({ params }) =>(
            <ExpenseUpsertView id={parseInt(params.id)} />
        ),
        meta: {
            pageTitle: "Chỉnh sửa chi phí",
            breadcrumbItems: [
                {
                    text: "Danh sách đơn nhập hàng",
                    to: routeGenerator.getSupplyListRoutePath()
                },
                { text: "Chỉnh sửa chi phí" },
            ]
        }
    },
    orderList: {
        path: /^\/orders\/?$/,
        element: async () => <OrderListView />,
        meta: {
            pageTitle: "Danh sách đơn bản lẻ",
            breadcrumbItems: [
                { text: "Danh sách đơn bản lẻ" },
            ]
        }
    },
    orderDetail: {
        path: /^\/orders\/(?<id>\d+)\/?$/,
        element: async ({ params }) =>(
            <OrderDetailView id={parseInt(params.id)} />
        ),
        meta: {
            pageTitle: "Chi tiết đơn bán lẻ",
            breadcrumbItems: [
                { text: "Danh sách đơn bản lẻ", to: routeGenerator.getOrderListRoutePath()},
                { text: "Chi tiết đơn bán lẻ" },
            ]
        }
    },
    orderCreate: {
        path: /^\/orders\/create\/?$/,
        element: async () => <OrderUpsertView />,
        meta: {
            pageTitle: "Tạo đơn bán lẻ mới",
            breadcrumbItems: [
                { text: "Danh sách đơn bản lẻ", to: routeGenerator.getOrderListRoutePath()},
                { text: "Tạo đơn bán lẻ mới" },
            ]
        }
    },
    orderUpdate: {
        path: /^\/orders\/(?<id>\d+)\/update\/?$/,
        element: async ({ params }) => (
            <OrderUpsertView id={parseInt(params.id)} />
        ),
        meta: {
            pageTitle: "Chỉnh sửa đơn bán lẻ",
            breadcrumbItems: [
                { text: "Danh sách đơn bản lẻ", to: routeGenerator.getOrderListRoutePath()},
                { text: "Chỉnh sửa đơn bán lẻ" },
            ]
        }
    },
    treatmentList: {
        path: /^\/treatments\/?$/,
        element: async () => <TreatmentListView />,
        meta: {
            pageTitle: "Danh sách liệu trình",
            breadcrumbItems: [
                { text: "Danh sách liệu trình" },
            ]
        }
    },
    treatmentDetail: {
        path: /^\/treatments\/(?<id>\d+)\/?$/,
        element: async ({ params }) => (
            <TreatmentDetailView id={parseInt(params.id)} />
        ),
        meta: {
            pageTitle: "Chi tiết liệu trình",
            breadcrumbItems: [
                {
                    text: "Danh sách liệu trình",
                    to: routeGenerator.getTreatmentListRoutePath()
                },
                { text: "Chi tiết liệu trình" },
            ]
        }
    },
    treatmentCreate: {
        path: /^\/treatments\/create\/?$/,
        element: async () => <TreatmentUpsertView />,
        meta: {
            pageTitle: "Tạo liệu trình mới",
            breadcrumbItems: [
                {
                    text: "Danh sách liệu trình",
                    to: routeGenerator.getTreatmentListRoutePath()
                },
                { text: "Tạo mới liệu trình" },
            ]
        }
    },
    treatmentUpdate: {
        path: /^\/treatments\/(?<id>\d+)\/update\/?$/,
        element: async ({ params }) => (
            <TreatmentUpsertView id={parseInt(params.id)} />
        ),
        meta: {
            pageTitle: "Chỉnh sửa liệu trình",
            breadcrumbItems: [
                {
                    text: "Liệu trình",
                    to: routeGenerator.getTreatmentListRoutePath()
                },
                { text: "Chỉnh sửa liệu trình" },
            ]
        }
    },
    debtOverviewView: {
        path: /^\/debts\/?$/,
        element: async () => <DebtOverviewView />,
        meta: {
            pageTitle: "Tổng quan nợ",
            breadcrumbItems: [{ text: "Tổng quan nợ" }],
        }
    },
    debtIncurrenceListView: {
        path: /^\/debts\/incurrences\/?$/,
        element: async () => <DebtIncurrenceListView />,
        meta: {
            pageTitle: "Danh sách khoản ghi nợ",
            breadcrumbItems: [
                { text: "Tổng quan nợ", to: routeGenerator.getDebtOverviewRoutePath() },
                { text: "Danh sách khoản ghi nợ" },
            ]
        }
    },
    debtIncurrenceDetailView: {
        path: /^\/debts\/incurrences\/(?<id>\d+)\/?$/,
        element: async ({ params }) => (
            <DebtIncurrenceDetailView id={parseInt(params.id)} />
        ),
        meta: {
            pageTitle: "Danh sách khoản ghi nợ",
            breadcrumbItems: [
                { text: "Tổng quan nợ", to: routeGenerator.getDebtOverviewRoutePath() },
                {
                    text: "Danh sách khoản ghi nợ",
                    to: routeGenerator.getDebtIncurrenceListRoutePath()
                },
                { text: "Chi tiết khoản ghi nợ" },
            ]
        }
    },
    debtIncurrenceCreateView: {
        path: /^\/debts\/incurrences\/create\/?$/,
        element: async () => <DebtIncurrenceUpsertView />,
        meta: {
            pageTitle: "Tạo khoản ghi nợ mới",
            breadcrumbItems: [
                { text: "Tổng quan nợ", to: routeGenerator.getDebtOverviewRoutePath() },
                {
                    text: "Danh sách khoản ghi nợ",
                    to: routeGenerator.getDebtIncurrenceListRoutePath()
                },
                { text: "Tạo khoản ghi nợ mới" },
            ]
        }
    },
    debtIncurrenceUpdateView: {
        path: /^\/debts\/incurrences\/(?<id>\d+)\/update\/?$/,
        element: async ({ params }) => (
            <DebtIncurrenceUpsertView id={parseInt(params.id)} />
        ),
        meta: {
            pageTitle: "Chỉnh sửa khoản ghi nợ",
            breadcrumbItems: [
                { text: "Tổng quan nợ", to: routeGenerator.getDebtOverviewRoutePath() },
                {
                    text: "Danh sách khoản ghi nợ",
                    to: routeGenerator.getDebtIncurrenceListRoutePath()
                },
                { text: "Chỉnh sửa khoản ghi nợ" },
            ]
        }
    },
    debtPaymentListView: {
        path: /^\/debts\/payments\/?$/,
        element: async () => <DebtPaymentListView />,
        meta: {
            pageTitle: "Danh sách khoản trả nợ",
            breadcrumbItems: [
                { text: "Tổng quan nợ", to: routeGenerator.getDebtOverviewRoutePath() },
                { text: "Danh sách khoản trả nợ" },
            ]
        }
    },
    debtPaymentDetailView: {
        path: /^\/debts\/payments\/(?<id>\d+)\/?$/,
        element: async ({ params }) => (
            <DebtPaymentDetailView id={parseInt(params.id)} />
        ),
        meta: {
            pageTitle: "Danh sách khoản trả nợ",
            breadcrumbItems: [
                { text: "Tổng quan nợ", to: routeGenerator.getDebtOverviewRoutePath() },
                {
                    text: "Danh sách khoản trả nợ",
                    to: routeGenerator.getDebtPaymentListRoutePath()
                },
                { text: "Chi tiết khoản trả nợ" },
            ]
        }
    },
    debtPaymentCreateView: {
        path: /^\/debts\/payments\/create\/?$/,
        element: async () => <DebtPaymentUpsertView />,
        meta: {
            pageTitle: "Tạo khoản trả nợ mới",
            breadcrumbItems: [
                { text: "Tổng quan nợ", to: routeGenerator.getDebtOverviewRoutePath() },
                {
                    text: "Danh sách khoản trả nợ",
                    to: routeGenerator.getDebtPaymentListRoutePath()
                },
                { text: "Tạo khoản trả nợ mới" },
            ]
        }
    },
    debtPaymentUpdateView: {
        path: /^\/debts\/payments\/(?<id>\d+)\/update\/?$/,
        element: async ({ params }) => <DebtPaymentUpsertView id={parseInt(params.id)} />,
        meta: {
            pageTitle: "Chỉnh sửa khoản trả nợ",
            breadcrumbItems: [
                { text: "Tổng quan nợ", to: routeGenerator.getDebtOverviewRoutePath() },
                {
                    text: "Danh sách khoản trả nợ",
                    to: routeGenerator.getDebtPaymentListRoutePath()
                },
                { text: "Chỉnh sửa khoản trả nợ" },
            ]
        }
    },
    reportView: {
        path: /^\/report\/?$/,
        element: async () => <ReportView />,
        meta: {
            pageTitle: "Báo cáo",
            breadcrumbItems: [{ text: "Tổng quan nợ" }]
        }
    }
};

const HomeRoutes = () => {
    // Dependencies.
    const navigate = useNavigate();
    const location = useLocation();
    const breadcrumbStore = useBreadcrumbStore();
    const pageLoadProgressBarStore = usePageLoadProgressBarStore();
    const alertModalStore = useAlertModalStore();
    const initialData = useInitialDataStore(state => state.data);

    // States.
    const [firstView, setFirstView] = useState<React.ReactNode | null>(<LoadingView />);
    const [secondView, setSecondView] = useState<React.ReactNode | null>(null);
    const [currentViewKey, setCurrentViewKey] = useState<1 | 2>(1);

    useEffect(() => {
        pageLoadProgressBarStore.start();
        const matchedPair = Object
            .entries(routes)
            .map(([viewName, route]) => ({ viewName, route }))
            .find(pair => pair.route.path.test(location.pathname));

        if (!matchedPair) {
            navigate(routeGenerator.getHomeRoutePath(), { replace: true });
            return;
        }

        const route = matchedPair.route;
        const match = location.pathname.match(route.path);
        const params: Params = match?.groups ?? {};
        route.element({ params, alertModalStore, initialData }).then(element => {
            if (currentViewKey === 1) {
                setSecondView(element);
                setCurrentViewKey(2);
            } else {
                setFirstView(element);
                setCurrentViewKey(1);
            }

            if (route.meta.breadcrumbItems) {
                let breadcrumbItems: BreadcrumbItem[];
                if (typeof route.meta.breadcrumbItems === "function") {
                    breadcrumbItems = route.meta.breadcrumbItems(params);
                } else {
                    breadcrumbItems = route.meta.breadcrumbItems;
                }
                breadcrumbStore.setItems(breadcrumbItems);
                document.title = route.meta.pageTitle ?? "";
            }
        });
    }, [location.pathname]);

    useEffect(() => {
        if (pageLoadProgressBarStore.phase === "finishing") {
            if (currentViewKey === 1) {
                setSecondView(null);
            } else {
                setFirstView(null);
            }
        }
    }, [pageLoadProgressBarStore.phase]);

    return (
        <Suspense>
            {firstView}
            {secondView}
        </Suspense>
    );
};

export default HomeRoutes;